import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useSession, signOut, } from 'next-auth/react';

export default function AvatarMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const router = useRouter()

    const session = useSession()
    const userImage = session?.data?.user?.image || ""
    const userName = session?.data?.user?.name

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Avatar
                    src={userImage}
                    variant="circular"
                    alt="Samuel Mabonga"
                    sx={{
                        width: ["2rem"],
                        height: ["2rem"],
                        display: ["flex"],
                        border: "1px solid primary.main",
                    }}
                />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={(event: any) => {
                        router.push("/select-role")
                        handleClose()
                    }}
                >
                    Switch Role
                </MenuItem>
                <MenuItem
                    onClick={handleClose}
                >
                    My account
                </MenuItem>
                <MenuItem
                    onClick={(event: any) => {
                        signOut()
                        handleClose()
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
}