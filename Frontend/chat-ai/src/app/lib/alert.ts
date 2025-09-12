import Swal from "sweetalert2";

export const openLoadingModal = () => {
    Swal.fire({
        title: 'Please wait...',
        text: 'Processing your request...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const closeLoadingModal = () => {
    Swal.close();
};

export const showResponseMessage = (isSuccess: boolean, message: string) => {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: isSuccess ? 'Success' : 'Error',
        text: message,
        confirmButtonColor: isSuccess ? '#28a745' : '#dc3545'
    });
};