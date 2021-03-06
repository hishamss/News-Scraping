$(document).ready(() => {
  $.get("/getSaved", (response) => {
    if (response.length === 0) {
      $("#noArtciles").show();
    }
    for (row of response) {
      var imageLink;
      if (row.img === undefined) {
        imageLink = "/assets/no-image-available.png";
      } else {
        imageLink = row.img;
      }
      $(".articles").append(
        `<div class="col mt-3 mb-3 rounded" data-id="${row._id}">
          <div class="card aritcleCard">
              <div class="card-body">
                  <div class="row">
                      <div class="col-md-9">
                          <h3 class=" card-title"><a href="${row.link}" target="_blank" class="headlineLink">${row.headline}</a>
                          </h3><br>
                          <p class="card-text">${row.description}</p>
                          <button type="button" class="btn btn-primary noteBtn" data-articleid="${row._id}">Add Note</button>
                      </div>
                      <div class="col-md-3"><i class="far fa-heart SavedHeart" id="${row._id}" data-toggle="tooltip" data-placement="top" title="Delete Article" aria-hidden="true"></i>
  
                      <span class="sr-only">Delete Article</span><img class="img-fluid aritcleImg" src="${imageLink}"></div>
                  </div>
              </div>
          </div>
      </div>
      <div class="w-100"></div>`
      );
    }
  });

  $(document).on("click", ".SavedHeart", function () {
    var id = $(this).attr("id");
    $.ajax({
      url: `/deleteArticle/${id}`,
      type: "DELETE",
      success: function (result) {
        if (result) {
          $(".articles").find(`[data-id=${id}]`).hide();
        }
      },
    });
  });

  $(document).on("click", ".noteBtn", function () {
    $(".noteDisplay").text("");
    $("#noteText").val("");
    $("#noteMsg").text("");
    ArticleId = $(this).data("articleid");

    $.get(`/getNotes/${ArticleId}`, (results) => {
      for (note of results.notes) {
        $(".noteDisplay").append(
          `<div class="col notesCol rounded">${note.text}<i class="fas fa-times"   data-noteindex="${note._id}" data-toggle="tooltip" data-placement="top" title="Delete Note" aria-hidden="true"></i>

      <span class="sr-only">Delete Note</span></div><div class="w-100"></div>`
        );
      }

      $(".notes").modal("show");
    });
  });

  $(".submitBtn").on("click", () => {
    $("#noteMsg").text("");
    $(".noteDisplay").text("");
    var Note = $("#noteText").val().trim();

    if (Note !== "") {
      $.post(
        `/addNote/${ArticleId}`,
        { text: Note, articleId: ArticleId },
        (response) => {
          $("#noteMsg").text(response);
          $.get(`/getNotes/${ArticleId}`, (results) => {
            for (note of results.notes) {
              $(".noteDisplay").append(
                `<div class="col notesCol rounded">${note.text}<i class="fas fa-times" data-noteindex="${note._id}" data-toggle="tooltip" data-placement="top" title="Delete Note" aria-hidden="true"></i>
    
          <span class="sr-only">Delete Note</span></div><div class="w-100"></div>`
              );
            }
          });
          // $(".noteDisplay").append(
          //   `<div class="col notesCol rounded">${Note}<i class="fas fa-times" data-index="${noteIndex}" data-toggle="tooltip" data-placement="top" title="Delete Note" aria-hidden="true"></i>

          //   <span class="sr-only">Delete Note</span></div><div class="w-100"></div>`
          // );
          // noteIndex++;
        }
      );
    } else {
      $("#noteMsg").text("Please add note!");
    }

    $("#noteText").val("");
  });

  $(document).on("click", ".fa-times", function () {
    var index = $(this).data("noteindex");

    var id = `${ArticleId},${index}`;

    $.ajax({
      url: `/deleteNote/${id}`,
      type: "DELETE",
      success: function (result) {
        if (result) {
          $(".noteDisplay").text("");
          $.get(`/getNotes/${ArticleId}`, (results) => {
            noteIndex = 0;
            for (note of results.notes) {
              $(".noteDisplay").append(
                `<div class="col notesCol rounded">${note.text}<i class="fas fa-times" data-index="${noteIndex}"
                data-noteindex="${note._id}" data-toggle="tooltip" data-placement="top" title="Delete Note" aria-hidden="true"></i>
      
                <span class="sr-only">Delete Note</span></div><div class="w-100"></div>`
              );
              noteIndex++;
            }

            $(".notes").modal("show");
          });
        }
      },
    });
  });
});
