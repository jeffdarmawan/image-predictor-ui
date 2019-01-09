$(function(){
    console.log($(window).height());
    $('body').css('max-height', $(window).height());

    var ul = $('#upload ul');

    $('#browse').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {

            // delete existing filename
            if($('#showimg li')) {
                console.log("print this 2");
                $('#showimg li').remove();
            }

            // display filename below dropzone
            var tpl = $('<li><input type="text" value="100" data-width="48" data-height="48"'+
                ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');
            // Append the file name and file size
            tpl.find('p').text(data.files[0].name)
                         .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

            // Add the HTML to the UL element
            data.context = tpl.appendTo(ul);

            // Initialize the knob plugin
            tpl.find('input').knob();

            $('#predict').attr('onclick', 'uploadIMG()');
        },

        progress: function(e, data) {

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();

            if (progress == 100) {
                data.context.removeClass('working');
            }
        }



    });

    // -------------------- from template ----------------------------
    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // -------------------- from template ----------------------------
    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

    // hide container-predict
    $('#container-predict').hide();

    // enable button after change in text
    $('#revise-text').change(function(){
        $('#revise-butt').click(function(){

            var rev = $('#revise-text').value;
            fetch(url + "/revise", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: {
                    revision: rev
                }
            }).then(response => {

                return response.json();

            }).then(data => {

                console.log(data);

            });
        });
    });

    // abis nunjukin predict-an nya, kalo mau upload image lg
    $("#upload-again").click(function() {
        location.reload();
    });


});

const url = 'upload.php';
const form = document.querySelector('form');

var imageLink = "";
var prediction = "";

var file = "";

function tempIMG(){
    file    = document.querySelector('input[type=file]').files[0];
    console.log(file);
}

function uploadIMG(){

    const formData = new FormData();

    formData.append(file.name, file);

    console.log("File name: " + file.name);
    console.log(formData);

    fetch(url + "/upload-img", {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    }).then(response => {

        return response.json();

    }).then(data => {
        console.log(data);
        imageLink = data.imageLink;
        prediction = data.prediction;
        console.log(imageLink + " " + prediction);
        goToPredict();
    });

}

function goToPredict(){
    $('#container-predict').slideDown();
    $('.image-out').attr("src", imageLink);
    $('#prediction').text("Prediction: " + prediction);
    $('#container-upload').hide();
}

