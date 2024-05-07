import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Paper,
} from "@mui/material";

function ConfirmationDialog({ open, handleClose, handleDelete }) {
  return (
    <Dialog
      open={open}
      //  onClose={handleClose}
      maxWidth="xs"
      fullWidth={true}
      sx={{
        ".MuiPaper-root": {
          borderRadius: "15px",
        },
      }}
    >
      <DialogTitle>
        <b>Delete Card</b>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are your sure ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            handleDelete();
            handleClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ConfirmationDialog;
