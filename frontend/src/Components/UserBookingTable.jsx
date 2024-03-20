import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Backdrop, Button, Fade, Modal, styled } from '@mui/material';
import { reformatDate } from '../helpers';
import CreateReviewModal from './CreateReviewModal';

export default function UserBookingTable (props) {
  const [openReviewModal, setOpenReviewModal] = React.useState(false);
  const listingId = props.listingId;
  const token = props.token;
  const fetchAllData = props.fetchAllData;
  const ReviewButton = styled(Button)({
    padding: '5px'
  })
  const TableTitle = styled(TableCell)({
    fontWeight: 'bold'
  })

  const StyledModal = styled(Paper)({
    maxWidth: '1100px',
    width: '85%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    boxShadow: 24,
    p: 4,
    padding: '20px'
  })

  const userBookings = props.userBookings;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableTitle>Booking Id</TableTitle>
            <TableTitle align="left"> Check in </TableTitle>
            <TableTitle align="left"> Check out </TableTitle>
            <TableTitle align="left"> Total Price</TableTitle>
            <TableTitle align="left"> Status</TableTitle>
            <TableTitle align="left"></TableTitle>
          </TableRow>
        </TableHead>
        <TableBody>
          {userBookings.map((booking) => (
            <TableRow
              key={booking.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {booking.id}
              </TableCell>
              <TableCell align="left">{reformatDate(booking.dateRange.start)}</TableCell>
              <TableCell align="left">{reformatDate(booking.dateRange.end)}</TableCell>
              <TableCell align="left">${booking.totalPrice}</TableCell>
              <TableCell align="left">{booking.status}</TableCell>
              <TableCell align="left">
                {
                  (booking.status === 'accepted') &&
                    <>
                      <ReviewButton variant="contained" onClick={e => setOpenReviewModal(true)}>
                        Review
                      </ReviewButton>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={openReviewModal}
                        onClose={e => setOpenReviewModal(false)}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          },
                        }}
                      >
                        <Fade in={openReviewModal}>
                          <StyledModal>
                            <CreateReviewModal
                              setOpenReviewModal={setOpenReviewModal}
                              openReviewModal={openReviewModal}
                              listingId={listingId}
                              bookingId={booking.id}
                              owner={booking.owner}
                              token={token}
                              fetchAllData={fetchAllData}
                            />
                          </StyledModal>
                        </Fade>
                      </Modal>
                    </>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
