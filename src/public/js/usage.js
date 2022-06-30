function editPickup() {
    console.log('editPickup')
    $('#btnEditPickup').on('click', function(e) {
        let pickupId = $(this).data('pickup-id');

        let formData = new FormData($('form#formEditPickup')[0]);
            let data = {
                id: pickupId,
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1]
            }
            handleEditPickup(data);
    });
}

function handleEditPickup(data) {
    $.ajax({
        method: "PUT",
        url: `${window.location.origin}/put-edit-pickup`,
        data: data,
        success: function(data) {
            alertify.success('Update is successful');
            window.location.href = `${window.location.origin}/dprofile`;
        },
        error: function(error) {
            alertify.error('An error occurs, please try again later!');
            console.log(error);
        }
    });
}

function deletePickupById() {
    console.log('deletePickupById')
    $('.delete-pickup-info').on('click', function(e) {
        if (!confirm('Are you sure you want to delete this pickup request?')) {
            return
        }
        let id = $(this).data('pickup-id');
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/delete-pickup`,
            data: { id: id },
            success: function(data) {
                alertify.success('Delete is successful');
            },
            error: function(err) {
                alertify.error('An error occurs, please try again later!');
                console.log(err)
            }
        });
    });
}

$(document).ready(function(e) {
    editPickup();
    deletePickupById();
});