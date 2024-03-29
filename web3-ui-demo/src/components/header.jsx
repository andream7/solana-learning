import { AppBar, Input, Toolbar, Typography } from "@mui/material";
import { AllInbox } from "@mui/icons-material";

export default function Header({ customButton }) {
  return (
    <AppBar position="relative">
      <Toolbar>
        <AllInbox sx={{ mr: 4 }} />
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
         Web3JS UI Demo 
        </Typography>
       
      </Toolbar>
    </AppBar>
  );
}
