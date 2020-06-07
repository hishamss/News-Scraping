$(document).ready(() => {
  $.get("/all", (response) => {
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

  $("#scapelnk").on("click", () => {
    $("#loading").show();
    $(".scraping").modal("show");
    $.get("/scrape", (result) => {
      $("#loading").hide();
      if (result) {
        $("#scrapeMsg").text(result);
      }
    });
  });

  $(".scraping").on("hidden.bs.modal", (e) => {
    location.href = "/";
  });

  $(document).on("click", ".SearchHeart", function () {
    var id = $(this).attr("id");
    $.ajax({
      url: `/saved/${id}`,
      type: "PUT",
      success: function (result) {
        if (result === "updated") {
          $(".articles").find(`[data-id=${id}]`).hide();
        }
      },
    });
  });
});
