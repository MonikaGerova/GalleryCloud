(function () {

    previewImage();

    document.forms[0].addEventListener("submit",function (event) {
        var response = document.getElementById("response");

        uploadRequest(this,response);

        event.preventDefault();
    }, false);

})();

function previewImage() {

    var fileInput = document.getElementById("photo");

    fileInput.addEventListener("change",function () {
        var box = document.getElementById("preview");

        var reader = new FileReader();
        reader.onload = function (e) {
            box.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(this.files[0]);
    });
}

function uploadRequest(form,response) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "upload.php", true);
    var formData = new FormData(form);

    httpRequest.onload = function() {

        if (httpRequest.status == 200) {
            response.innerHTML = "Uploaded!";
        } else {
            response.innerHTML = "Error occurred when trying to upload your file.<br \/>";

            console.log(httpRequest.response);
        }
    };

    httpRequest.send(formData);
}
