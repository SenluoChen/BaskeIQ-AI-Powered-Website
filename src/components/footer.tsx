import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
       
        py: 3,
        textAlign: "center",
        backgroundColor: "#0B0F19",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          letterSpacing: 0.3,
          color: "rgba(230,237,243,0.72)",
        }}
      >
        © {new Date().getFullYear()} BaskeIQ — AI-powered Basketball Community
      </Typography>
    </Box>
  );
}
