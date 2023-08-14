import * as React from 'react';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { FilterList } from '@mui/icons-material';
import { Menu, MenuItem, Select } from '@mui/material';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function FilterBadge({status, setStatus, statuses}: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton aria-label="filter" onClick={handleClick}>
        <StyledBadge badgeContent={4} color="primary">
          <FilterList />
        </StyledBadge>
      </IconButton>

      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // MenuListProps={{
        //   'aria-labelledby': 'basic-button',
        // }}
      >
        <Select>
          <MenuItem onClick={handleClose}>All</MenuItem>
          <MenuItem onClick={handleClose}>All</MenuItem>
        </Select>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}