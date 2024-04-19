import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import { Lock as LockIcon } from "../icons/lock";
import { Selector as SelectorIcon } from "../icons/selector";
import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
import { User as UserIcon } from "../icons/user";
import { UserAdd as UserAddIcon } from "../icons/user-add";
import { Users as UsersIcon } from "../icons/users";
import { XCircle as XCircleIcon } from "../icons/x-circle";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InventoryIcon from "@mui/icons-material/Inventory";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import HealingIcon from "@mui/icons-material/Healing";
import MessageIcon from "@mui/icons-material/Message";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Image from "next/image";

const items = [
  {
    href: "/",
    icon: <ChartBarIcon fontSize="small" />,
    title: "Dashboard",
  },
  {
    href: "/fetchDonors",
    icon: <UsersIcon fontSize="small" />,
    title: "Donors",
  },
  {
    href: "/fetchDonations",
    icon: <BloodtypeIcon fontSize="small" />,
    title: "Donations",
  },
  {
    href: "/fetchRequests",
    icon: <HealingIcon fontSize="small" />,
    title: "Requests",
  },
  {
    href: "/fetchOrders",
    icon: <LocalShippingIcon fontSize="small" />,
    title: "Orders",
  },
  {
    href: "/fetchTransfusion",
    icon: <VaccinesIcon fontSize="small" />,
    title: "Transfusion",
  },
  {
    href: "/inventory",
    icon: <InventoryIcon fontSize="small" />,
    title: "Inventory",
  },
  {
    href: "/fetchCommunication",
    icon: <MessageIcon fontSize="small" />,
    title: "Messages",
  },
  {
    href: "/fetchCampaigns",
    icon: <CampaignIcon fontSize="small" />,
    title: "Blood Campaigns",
  },
  {
    href: "#",
    icon: <AssessmentIcon fontSize="small" />,
    title: "Reports",
  },
  {
    href: "#",
    icon: <CogIcon fontSize="small" />,
    title: "Settings",
  },
  {
    href: "#",
    icon: <UserIcon fontSize="small" />,
    title: "Users",
  },
  // {
  //   href: '/public',
  //   icon: (<UsersIcon fontSize="small" />),
  //   title: 'Public'
  // },
  // {
  //   href: '/customers',
  //   icon: (<UsersIcon fontSize="small" />),
  //   title: 'Customers'
  // },
  // {
  //   href: '/products',
  //   icon: (<ShoppingBagIcon fontSize="small" />),
  //   title: 'Products'
  // },
  // {
  //   href: '/account',
  //   icon: (<UserIcon fontSize="small" />),
  //   title: 'Account'
  // },
  // {
  //   href: '/settings',
  //   icon: (<CogIcon fontSize="small" />),
  //   title: 'Settings'
  // },
  // {
  //   href: '/login',
  //   icon: (<LockIcon fontSize="small" />),
  //   title: 'Login'
  // },
  // {
  //   href: '/register',
  //   icon: (<UserAddIcon fontSize="small" />),
  //   title: 'Register'
  // },
  // {
  //   href: '/404',
  //   icon: (<XCircleIcon fontSize="small" />),
  //   title: 'Error'
  // }
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
            <NextLink href="/" passHref>
              <a style={{ textDecoration: "none" }}>
                <Image src="/static/images/bpLogo.png" alt="logo" width={100} height={100} />
                <br />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              <div>
                <Typography color="inherit" variant="subtitle1">
                  <span style={{ color: "#ca433b" }}>Blood</span>
                  <span style={{ color: "#888888" }}>Point</span>
                </Typography>
              </div>
            </Box>
          </Box>
        </div>
        <Box sx={{ flexGrow: 1, paddingTop: 4 }}>
          {items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
