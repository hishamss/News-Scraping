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
                          <h5 class=" card-title"><a href="${row.link}" target="_blank">${row.headline}</a>
                          </h5>
                          <p class="card-text">${row.description}</p>
                      </div>
                      <div class="col-md-3"><i class="far fa-heart SearchHeart" id="${row._id}" data-toggle="tooltip" data-placement="top" title="save this Article" aria-hidden="true"></i>
  
                      <span class="sr-only">save this Article</span><img class="img-fluid aritcleImg" src="${row.img}"></div>
                  </div>
              </div>
          </div>
      </div>
      <div class="w-100"></div>`
      );
    }
  });
  $("#clearSavedLnk").on("click", () => {
    $.ajax({
      url: "/clearSaved",
      type: "DELETE",
      success: function (result) {
        console.log(result);
      },
    });
  });
});
