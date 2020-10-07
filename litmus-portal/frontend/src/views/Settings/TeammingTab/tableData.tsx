import { useMutation } from '@apollo/client/react/hooks';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import ButtonFilled from '../../../components/Button/ButtonFilled';
import ButtonOutline from '../../../components/Button/ButtonOutline';
import Loader from '../../../components/Loader';
import Unimodal from '../../../containers/layouts/Unimodal';
import { REMOVE_INVITATION } from '../../../graphql/mutations';
import { GET_USER } from '../../../graphql/quries';
import { MemberInvitation } from '../../../models/graphql/invite';
import { Member } from '../../../models/graphql/user';
import { RootState } from '../../../redux/reducers';
import userAvatar from '../../../utils/user';
import useStyles from './styles';

interface TableDataProps {
  row: Member;
  index: number;
}
const TableData: React.FC<TableDataProps> = ({ row, index }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const [role, setRole] = useState<string>('Viewer');

  const userData = useSelector((state: RootState) => state.userData);

  // for closing the menu option
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = React.useState(false);
  // Function to display date in format Do MMM,YYYY Hr:MM AM/PM
  const formatDate = (date: string) => {
    const day = moment(date).format('Do MMM, YYYY LT');
    return day;
  };

  // mutation to remove member
  const [removeMember, { loading }] = useMutation<MemberInvitation>(
    REMOVE_INVITATION,
    {
      onCompleted: () => {
        setOpen(false);
      },
      onError: () => {},
      refetchQueries: [
        { query: GET_USER, variables: { username: userData.username } },
      ],
    }
  );

  return (
    <>
      <TableCell className={classes.firstTC} component="th" scope="row">
        <div className={classes.firstCol}>
          <Avatar
            data-cy="avatar"
            alt="User"
            className={classes.avatarBackground}
          >
            {row?.name ? userAvatar(row.name) : userAvatar(row.name)}
          </Avatar>
          {row.name}
        </div>
      </TableCell>
      <TableCell className={classes.otherTC}>
        {row.role}
        {row.role === 'editor' || row.role === 'viewer' ? (
          <>
            <IconButton
              disabled
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
              className={classes.optionBtn}
            >
              <img src="./icons/right-arrow.svg" alt="more" />
            </IconButton>
            <Menu
              keepMounted
              open={Boolean(anchorEl)}
              id="long-menu"
              anchorEl={anchorEl}
              onClose={handleClose}
            >
              <MenuItem
                value={index}
                onClick={() => {
                  setAnchorEl(null);
                }}
                className={classes.menuOpt}
              >
                <div className={classes.menuDiv}>
                  <div>
                    <Typography className={classes.menuHeader}>
                      <strong>Editor</strong>
                    </Typography>
                  </div>
                  <div>
                    <Typography className={classes.menuDesc}>
                      Can make changes in the project
                    </Typography>
                  </div>
                </div>
              </MenuItem>
              <MenuItem
                value={index}
                onClick={() => {
                  setAnchorEl(null);
                }}
                className={classes.menuOpt}
              >
                <div className={classes.menuDiv}>
                  <div>
                    <Typography className={classes.menuHeader}>
                      <strong>Viewer</strong>
                    </Typography>
                  </div>
                  <div>
                    <Typography className={classes.menuDesc}>
                      Can make changes in the project
                    </Typography>
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <></>
        )}
      </TableCell>
      <TableCell className={classes.otherTC}>{row.email}</TableCell>
      <TableCell className={classes.otherTC}>
        <div className={classes.dateDiv}>
          <img
            className={classes.calIcon}
            src="./icons/calendarIcon.svg"
            alt="calendar"
          />
          {formatDate(row.joined_at)}
        </div>
      </TableCell>

      <TableCell className={classes.otherTC} key={row.user_name}>
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <img alt="delete" src="./icons/bin-grey.svg" />
        </IconButton>
      </TableCell>
      <Unimodal
        isOpen={open}
        handleClose={() => {
          setOpen(false);
        }}
        hasCloseBtn
      >
        <div className={classes.body}>
          <img src="./icons/userDel.svg" alt="lock" />
          <div className={classes.text}>
            <Typography className={classes.typo} align="center">
              Are you sure
              <strong> to remove the current user?</strong>
            </Typography>
          </div>
          <div className={classes.textSecond}>
            <Typography className={classes.typoSub} align="center">
              <>The user will lose access to the team’s work and all</>
            </Typography>
          </div>
          <div className={classes.buttonGroup}>
            <ButtonOutline
              isDisabled={false}
              handleClick={() => {
                setOpen(false);
              }}
            >
              <>No</>
            </ButtonOutline>

            <ButtonFilled
              isDisabled={loading}
              isPrimary
              handleClick={() => {
                removeMember({
                  variables: {
                    data: {
                      project_id: userData.selectedProjectID,
                      user_name: row.user_name,
                    },
                  },
                });
              }}
            >
              <>
                {loading ? (
                  <div>
                    <Loader size={20} />
                  </div>
                ) : (
                  <>Yes</>
                )}
              </>
            </ButtonFilled>
          </div>
        </div>
      </Unimodal>
    </>
  );
};
export default TableData;
