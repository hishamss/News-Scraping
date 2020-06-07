$(document).ready(() => {
  $.get("/getSaved", (response) => {
    if (response.length === 0) {
      $("#noArtciles").show();
    }
    for (row of response) {
      $(".articles").append(
        `<div class="col mt-3 mb-3 rounded" data-id="${row._id}">
          <div class="card aritcleCard">
              <div class="card-body">
                  <div class="row">
                      <div class="col-md-9">
                          <h3 class=" card-title"><a href="${row.link}" target="_blank" class="headlineLink">${row.headline}</a>
                          </h3><br>
                          <p class="card-text">${row.description}</p>
                          <button type="button" class="btn btn-primary noteBtn" data-noteid="${row._id}">Add Note</button>
                      </div>
                      <div class="col-md-3"><i class="far fa-heart SavedHeart" id="${row._id}" data-toggle="tooltip" data-placement="top" title="Delete Article" aria-hidden="true"></i>
  
                      <span class="sr-only">Delete Article</span><img class="img-fluid aritcleImg" src="${row.img}"></div>
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
    NoteId = $(this).data("noteid");
    $.get(`/getNotes/${NoteId}`, (results) => {
      for (note of results[0].notes) {
        $(".noteDisplay").append(
          `<div class="col notesCol rounded">${note}</div><div class="w-100"></div>`
        );
      }

      $(".notes").modal("show");
    });
  });

  $(".submitBtn").on("click", () => {
    $("#noteMsg").text("");
    var Note = $("#noteText").val().trim();
    if (Note !== "") {
      $.post(`/addNote/${NoteId}`, { note: Note }, (response) => {
        $("#noteMsg").text(response);
        $(".noteDisplay").append(
          `<div class="col notesCol rounded">${Note}</div><div class="w-100"></div>`
        );
      });
    } else {
      $("#noteMsg").text("Please add note!");
    }

    $("#noteText").val("");
  });
});
