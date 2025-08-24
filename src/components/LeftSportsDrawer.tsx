import React from "react";
import {
  Drawer,
  List,
  ListItem,
  Box,
  Divider,
  Typography,
  IconButton,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';



type NearbyGame = {
  id: string;
  venue: string;        // "Terrain Villejuif"
  weekday: string;      // "Tuesday"
  date: string;         // "2025-06-27"
  interested: number;   // 8
  distanceKm?: number;  // 1.2
  time?: string;        // "19:00"
};

type Props = {
  open: boolean;
  onClose: () => void;
  onJoin?: (id: string) => void;
  games?: NearbyGame[];
  width?: number;
};

const DEFAULT_WIDTH = 320; // 稍微加寬以減少擁擠（可傳入覆蓋）

export default function LeftSportsDrawer({
  open,
  onClose,
  onJoin,
  games = [
    { id: "1", venue: "Terrain Villejuif", weekday: "Tuesday",  date: "2025-06-27", interested: 8,  distanceKm: 1.2, time: "19:00" },
    { id: "2", venue: "Gymnase Ivry",      weekday: "Friday",   date: "2025-06-27", interested: 5,  distanceKm: 2.4, time: "20:00" },
    { id: "3", venue: "Palais des Sports", weekday: "Sunday",   date: "2025-06-27", interested: 12, distanceKm: 4.1, time: "16:00" },
    { id: "4", venue: "Paris 13e",         weekday: "Wednesday",date: "2025-06-27", interested: 7,  distanceKm: 3.0, time: "18:00" },
  ],
  width = DEFAULT_WIDTH,
}: Props) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{ zIndex: (t) => t.zIndex.modal + 1 }} // ~1
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(2px)',
          },
        },
      }}
      PaperProps={{
        sx: {
          width,
          background: 'linear-gradient(180deg, #0B0F19 0%, #0F1623 100%)',
          color: '#E6EDF3',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        },
      }}
    >
      {/* Header（黏在頂部，列表捲動時保留） */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          px: 2,
          pt: 2,
          pb: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(4px)",
          background:
            "linear-gradient(180deg, rgba(11,15,25,0.92) 0%, rgba(15,22,35,0.92) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', }}>
          <SportsBasketballIcon
            sx={{
              color: '#ffca28',                           // 和 Matches 顏色一致
              fontSize: 32,                               // 大小
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))', // 微陰影
              mr: 1.5,                                    // 與文字間距
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              color: '#ffca28',
              textShadow: '0 0 10px rgba(255, 167, 38, 0.4)', // 微光暈
            }}
          >
    Nearby Games
          </Typography>
        </Box>
    
      </Box>

      {/* List */}
      <List
        sx={{
          px: 1.25,
          py: 1.25,
          display: "flex",
          flexDirection: "column",
          gap: 1.25, // 卡片之間留白
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 6,
          },
        }}
      >
        {games.length === 0 && (
          <Typography
            variant="body2"
            sx={{ px: 1.5, py: 1.5, color: "rgba(230,237,243,0.7)" }}
          >
            No nearby games.
          </Typography>
        )}

        {games.map((g) => (
          <ListItem key={g.id} disableGutters sx={{}}>
            <Box
              sx={{
                width: "100%",
                p: 1.25,
                borderRadius: "15px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                boxShadow: "0 10px 24px rgba(0,0,0,.26)",
                transition: "transform .15s ease, box-shadow .15s ease, background .15s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 14px 32px rgba(0,0,0,.34)",
                  background: "rgba(255,255,255,0.045)",
                },
              }}
            >
              {/* 第一行：場地 + Join */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1.25,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: 0.2,
                      mb: 0.25,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={g.venue}
                  >
                    {g.venue}
                  </Typography>

                  {/* 標籤列：星期 / 日期 / 時間 / 距離 */}
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    <Chip
                      size="small"
                      icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                      label={g.weekday}
                      sx={chipSx}
                    />
                    <Chip
                      size="small"
                      icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                      label={g.date}
                      sx={chipSx}
                    />
                    {g.time && (
                      <Chip
                        size="small"
                        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                        label={g.time}
                        sx={chipSx}
                      />
                    )}
                    {g.distanceKm !== undefined && (
                      <Chip
                        size="small"
                        icon={<PlaceOutlinedIcon sx={{ fontSize: 16 }} />}
                        label={`${g.distanceKm} km`}
                        sx={chipSx}
                      />
                    )}
                  </Stack>
                </Box>

                <Stack spacing={0.75} alignItems="flex-end" sx={{ flexShrink: 0 }}>
                  <Button
                    size="small"
                    onClick={() => onJoin?.(g.id)}
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      px: 1.8,
                      borderRadius: 1.5,
                      backgroundColor: "#ffca28",
                      color: "#0B0F19",
                      "&:hover": { backgroundColor: "#19e3ff" },
                    }}
                  >
                    Join
                  </Button>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PeopleAltOutlinedIcon sx={{ fontSize: 16, opacity: 0.85 }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(230,237,243,0.85)" }}
                    >
                      {g.interested} interested
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mt: 0.25 }} />

      <Box
        sx={{
          textAlign: "center",
          fontSize: 13,
          fontFamily: "Inter, Roboto, sans-serif",
          color: "rgba(230,237,243,0.6)",
          py: 1.25,
        }}
      >
        BaskeIQ  {new Date().getFullYear()}
      </Box>
    </Drawer>
  );
}

/** 共用 Chip 樣式：沉穩、簡潔 **/
const chipSx = {
  bgcolor: "rgba(255,255,255,0.06)",
  color: "rgba(230,237,243,0.9)",
  borderRadius: 1.25,
  "& .MuiChip-icon": { color: "rgba(230,237,243,0.8)" },
  "&:hover": { bgcolor: "rgba(255,255,255,0.09)" },
} as const;
