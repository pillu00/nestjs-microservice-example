import { renderHook, act } from "@testing-library/react";
import useAsync from "./useAsync";

const defaultState = {
  data: null,
  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  error: null,
  status: "idle",
  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
};

const deferred = () => {
  let resolve!: (value?: unknown) => void;
  let reject!: (reason?: any) => void;
  const promise: Promise<unknown> = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useAsync", () => {
  test("calling run with a promise which resolves", async () => {
    const { result } = renderHook(() => useAsync());
    expect(result.current).toEqual(defaultState);
    const { promise, resolve } = deferred();
    let p: Promise<unknown>;
    act(() => {
      p = result.current.run(promise);
    });

    expect(result.current).toEqual({
      ...defaultState,
      isIdle: false,
      isLoading: true,
      status: "pending",
    });

    const resolvedValue = Symbol("resolved value");
    await act(async () => {
      resolve(resolvedValue);
      await p;
    });

    expect(result.current).toEqual({
      ...defaultState,
      data: resolvedValue,
      isIdle: false,
      isLoading: false,
      isSuccess: true,
      status: "resolved",
    });

    act(() => result.current.reset());
    expect(result.current).toEqual(defaultState);
  });

  test("calling run with a promise which rejects", async () => {
    const { result } = renderHook(() => useAsync());
    expect(result.current).toEqual(defaultState);
    const { promise, reject } = deferred();
    let p: Promise<unknown>;
    act(() => {
      p = result.current.run(promise);
    });

    expect(result.current).toEqual({
      ...defaultState,
      isIdle: false,
      isLoading: true,
      status: "pending",
    });

    const rejectedValue = Symbol("rejected value");
    await act(async () => {
      reject(rejectedValue);
      await p.catch(() => {
        /* ignore error */
      });
    });

    expect(result.current).toEqual({
      ...defaultState,
      status: "rejected",
      isIdle: false,
      isLoading: false,
      isError: true,
      error: rejectedValue,
    });
  });

  test("No state updates happen if the component is unmounted while pending", async () => {
    const { result, unmount } = renderHook(() => useAsync());
    expect(result.current).toEqual(defaultState);
    const { promise, resolve } = deferred();
    let p: Promise<unknown>;

    act(() => {
      p = result.current.run(promise);
    });

    expect(result.current).toEqual({
      ...defaultState,
      status: "pending",
      isIdle: false,
      isLoading: true,
    });

    unmount();

    await act(async () => {
      resolve();
      await p;
    });

    expect(result.current).toEqual({
      ...defaultState,
      status: "pending",
      isIdle: false,
      isLoading: true,
    });
  });

  test('calling "run" without a promise results in an early error', async () => {
    const { result } = renderHook(() => useAsync());
    expect(result.current).toEqual(defaultState);

    await expect(
      result.current.run(undefined as any as Promise<unknown>)
    ).rejects.toThrowError(
      new Error(
        "The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"
      )
    );
  });
});
