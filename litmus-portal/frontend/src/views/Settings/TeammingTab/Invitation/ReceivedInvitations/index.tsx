import { useMutation, useQuery } from '@apollo/client/react/hooks';
import {
  Avatar,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonFilled from '../../../../../components/Button/ButtonFilled';
import ButtonOutline from '../../../../../components/Button/ButtonOutline';
import Toast from '../../../../../components/Toast';
import {
  ACCEPT_INVITE,
  DECLINE_INVITE,
  GET_USER,
} from '../../../../../graphql';
import { MemberInvitation } from '../../../../../models/graphql/invite';
import {
  CurrentUserDedtailsVars,
  CurrentUserDetails,
} from '../../../../../models/graphql/user';
import { RootState } from '../../../../../redux/reducers';
import userAvatar from '../../../../../utils/user';
import useStyles from './styles';

interface ReceivedInvitation {
  projectName: string;
  username: string;
  role: string;
  projectID: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const ReceivedInvitations: React.FC = () => {
  const classes = useStyles();

  // for response data
  const [rows, setRows] = useState<ReceivedInvitation[]>([]);

  const username = useSelector((state: RootState) => state.userData.username);

  // stores the user whose invitation is accepted/declined
  const [acceptDecline, setAcceptDecline] = useState<string>('');

  // state to open snackbar when invitation is accepted
  const [openSnackbar, setOpenSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'success',
  });

  // mutation to accept the invitation
  const [acceptInvite] = useMutation<MemberInvitation>(ACCEPT_INVITE, {
    onCompleted: () => {
      setRows(rows.filter((row) => row.username !== acceptDecline));
    },
    onError: () => {},
    refetchQueries: [{ query: GET_USER, variables: { username } }],
  });

  // mutation to decline the invitation
  const [declineInvite] = useMutation<MemberInvitation>(DECLINE_INVITE, {
    onCompleted: () => {
      setRows(rows.filter((row) => row.username !== acceptDecline));
    },
    onError: () => {},
    refetchQueries: [{ query: GET_USER, variables: { username } }],
  });

  // query for getting all the data for the logged in user
  const { data } = useQuery<CurrentUserDetails, CurrentUserDedtailsVars>(
    GET_USER,
    { variables: { username } }
  );

  useEffect(() => {
    if (data?.getUser.username === username) {
      const projectList = data?.getUser.projects;
      const users: ReceivedInvitation[] = [];

      let flag = 0;

      projectList.forEach((project) => {
        project.members.forEach((member) => {
          if (
            member.user_name === username &&
            member.role !== 'Owner' &&
            member.invitation === 'Pending'
          ) {
            flag = 1;
          }
        });
        if (flag === 1) {
          project.members.forEach((member) => {
            if (member.user_name !== username && member.role === 'Owner') {
              users.push({
                username: member.user_name,
                role: member.role,
                projectName: project.name,
                projectID: project.id,
              });
            }
          });
          flag = 0;
        }
      });

      setRows(users);
    }
  }, [data]);

  return (
    <div>
      <TableContainer className={classes.table}>
        <Table>
          {/* <button
            onClick={() => {
              setOpenSnackbar({
                open: true,
                message: 'Invitation Declined!',
                type: 'error',
              });
            }}
          >
            <div>Ignore</div>
          </button>
          <button
            onClick={() => {
              setOpenSnackbar({
                open: true,
                message: 'Invitation Accepted!',
                type: 'success',
              });
            }}
          >
            <div>Ignore</div>
          </button>  */}
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.username}>
                <TableCell>
                  <div className={classes.rowDiv}>
                    <div className={classes.firstCol}>
                      <Avatar
                        data-cy="avatar"
                        alt="User"
                        className={classes.avatarBackground}
                        style={{ alignContent: 'right' }}
                      >
                        {row.username
                          ? userAvatar(row.username)
                          : userAvatar(row.username)}
                      </Avatar>
                      <div className={classes.detail}>
                        <div> {row.username}</div>
                        <div>{row.projectName}</div>
                      </div>
                    </div>
                    <div className={classes.buttonDiv}>
                      <ButtonOutline
                        handleClick={() => {
                          setOpenSnackbar({
                            open: true,
                            message: 'Invitation Declined!',
                            type: 'error',
                          });
                          setAcceptDecline(row.username);
                          declineInvite({
                            variables: {
                              member: {
                                project_id: row.projectID,
                                user_name: username,
                              },
                            },
                          });
                        }}
                        isDisabled={false}
                      >
                        <div>Ignore</div>
                      </ButtonOutline>
                      <ButtonFilled
                        isPrimary={false}
                        handleClick={() => {
                          setOpenSnackbar({
                            open: true,
                            message: 'Invitation Accepted!',
                            type: 'success',
                          });
                          setAcceptDecline(row.username);
                          acceptInvite({
                            variables: {
                              member: {
                                project_id: row.projectID,
                                user_name: username,
                              },
                            },
                          });
                        }}
                        isDisabled={false}
                      >
                        <div>Accept</div>
                      </ButtonFilled>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography align="center">No invitations received.</Typography>
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainer>
      <Toast
        style={{ bottom: '10rem' }}
        open={openSnackbar.open}
        message={openSnackbar.message}
        type={openSnackbar.type}
        onClose={() =>
          setOpenSnackbar({ open: false, message: '', type: 'success' })
        }
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      />
    </div>
  );
};

export default ReceivedInvitations;
