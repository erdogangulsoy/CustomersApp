$(function () {
    var signedUrl;
    if (initial_files !== undefined && initial_files.length > 0) {

        for (var i = 0; i < initial_files.length; i++) {
            var file = initial_files[i];
            const ctr = updateImageDisplay(file.name, file.file_url, file.public_url);

            const progress = ctr.querySelector(".progress");
            const btnCommands = ctr.querySelector("#btn-commands");

            progress.classList.toggle("d-none");
            btnCommands.querySelectorAll(".btn").forEach(e => { e.classList.toggle("d-none"); }); 
        }
    }

    var input = document.getElementById('fileInput');

    input.addEventListener('change', function () {
        var pList = [];
        const files = input.files;

        if (!files.length) {
            return;
        }

        for (var i = 0; i < files.length; i++) {
            pList.push(uploadfile(files[i]));
        }

        Promise.all(pList)
            .then(function (res) {
                document.getElementById("frmTest").reset();

                for (var i = 0; i < res.length; i++) {
                    if (settings.debug) console.log("Dosya Yüklendi: " + res[i].container + res[i].file);
                  
                }
            })
            .catch(function (er) {
            });



        function uploadfile(selectedFile) {
            return new Promise(function (resolve, reject) {

                $.ajax({
                    type: "POST",
                    url: '/api/gcs',
                    headers: {
                        "X-CSRF-TOKEN": csrftoken
                    },
                    contentType: 'application/json',
                    data: JSON.stringify({
                        file: selectedFile.name,
                        mimeType: selectedFile.type
                    }),
                    dataType: "json",
                    success: function (response) {

                        if (response.hasOwnProperty("error")) {
                            showMessage(response.error);
                            return;
                        }

                        signedUrl = response.data.sas;


                        var ctr = updateImageDisplay(selectedFile.name, URL.createObjectURL(selectedFile), response.data.public_url);

                        const xhr = new XMLHttpRequest();
                        xhr.open("PUT", signedUrl, true);
                        xhr.onload = () => {
                            const status = xhr.status;
                            if (status === 200) {
                                const progress = ctr.querySelector(".progress");
                                const btnCommands = ctr.querySelector("#btn-commands");

                                progress.classList.toggle("d-none");
                                btnCommands.querySelectorAll(".btn").forEach(e => { e.classList.toggle("d-none"); });

                                resolve({ durum: "bitti" });
                            } else {
                                alert("Something went wrong!");
                            }
                        };
                        xhr.upload.onprogress = () => {
                            var percent = (event.loaded / event.total) * 100;
                            var tt = Math.round(percent);
                            console.log(tt);

                            const pb = ctr.querySelector(".progress-bar");
                            pb.setAttribute("aria-valuenow", tt);
                            //pb.textContent = tt;
                            pb.style.width = tt + "%";


                        }
                        xhr.onerror = () => {
                            alert("Something went wrong");
                        };
                        xhr.setRequestHeader('Content-Type', selectedFile.type);
                        xhr.send(selectedFile);




                    },
                    failure: function (response) {
                        reject({ error });
                    }
                });

            })
        };



    });

   
    function remove_pic(e) {
        e.currentTarget.closest(".pic").remove();
    }
    function updateImageDisplay(file_name, file_url, public_url) {

        const preview = document.querySelector('.preview');

        const card = `<div class="pic mb-2" data-url="${public_url}">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                    <img src="${file_url}" style="max-width: 50px;" alt="...">
                        </div>
                    <div class="flex-grow-1 px-2 text-truncate">
                        <p class="mt-0 mb-0">${file_name}</p>
                        <div class="progress rounded-0">
                            <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="ms-2" id="btn-commands">
                       <button type="button" class="btn btn-danger btn-floating d-none">
  <i class="far fa-trash-alt"></i>
</button>
                    </div>
                </div>
        </div>`;

        preview.insertAdjacentHTML('beforeend', card);
        const lastChild = preview.querySelector(".pic:last-child");
        lastChild.querySelector("#btn-commands .btn-danger").addEventListener("click", remove_pic);

        return lastChild;
    }
   
});