import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import useAsync from "../hooks/useAsync";
import React from "react";
import fetchData from "../utils/fetch";

const FETCH_CHANNELS_API_URL = "http://localhost:3000/channels/";

export interface Channel {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  created_at: string;
  elevation: string;
  last_entry_id: number;
  public_flag: boolean;
  url: string;
  ranking: number;
  github_url: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

interface ChannelsProp {
  access_token: string;
}

export default function Channels({ access_token }: ChannelsProp) {
  const { run, data: channels, isLoading, isError } = useAsync<Channel[]>();

  React.useEffect(() => {
    run(
      fetchData(FETCH_CHANNELS_API_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <CircularProgress size={100} />;
  }

  if (isError) {
    return <div>An Error Occurred</div>;
  }

  return (
    <div>
      {channels?.map((channel) => (
        <>
          <Divider />
          <Box>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ color: "text.secondary", fontSize: 14 }}
                >
                  {channel?.name}
                </Typography>
                <Typography variant="h5" component="div">
                  {channel.ranking}
                </Typography>

                <Typography variant="body2">{channel.description}</Typography>
              </CardContent>
            </Card>
          </Box>
        </>
      ))}
    </div>
  );
}
