$(document).ready(function () {
	$(".firma").drags();

	$(".tab-list").on("click", ".tab", function (event) {
		event.preventDefault();

		$(".tab").removeClass("active");
		$(".tab-content").removeClass("show");

		$(this).addClass("active");
		$($(this).attr("href")).addClass("show");
	});

	$("#pdf-form").submit(function (e) {
		e.preventDefault();
		var formData = new FormData(this);
		var $previewContainer = $("#preview");
		$previewContainer.find(".tab-list").empty();
		$previewContainer.find(".tab-content").remove();
		$previewContainer.find(".tab-list").append("<span>Cargando...</span>");
		$.ajax({
			url: "http://localhost:3000/convertir",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				$previewContainer.find(".tab-list").empty();
				var contador = 1;
				response.images.forEach((filename) => {
					$previewContainer
						.find(".tab-list")
						.append('<a class="tab" href="#tab-' + contador + '">Página ' + contador + "</a>");
					$previewContainer
						.find(".tabs")
						.append(
							'<div id="tab-' +
								contador +
								'" class="tab-content"><img src="http://localhost:3000/imagenes/' +
								filename +
								'" class="img-page"/></div>'
						);
					contador++;
				});
				$previewContainer.find(".tab:first").addClass("active");
				$previewContainer.find(".tab-content:first").addClass("show");
			},
			error: function (error) {
				console.error(error);
			},
		});
	});
});

$.fn.drags = function (opt) {
	opt = $.extend({ handle: "", cursor: "move" }, opt);

	if (opt.handle === "") {
		var $el = this;
	} else {
		var $el = this.find(opt.handle);
	}

	return $el
		.css("cursor", opt.cursor)
		.on("mousedown", function (e) {
			if (opt.handle === "") {
				var $drag = $(this).addClass("draggable");
			} else {
				var $drag = $(this).addClass("active-handle").parent().addClass("draggable");
			}
			var z_idx = $drag.css("z-index"),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag
				.css("z-index", 1000)
				.parents()
				.on("mousemove", function (e) {
					$(".draggable")
						.offset({
							top: e.pageY + pos_y - drg_h,
							left: e.pageX + pos_x - drg_w,
						})
						.on("mouseup", function () {
							$(this).removeClass("draggable").css("z-index", z_idx);
						});
				});
			e.preventDefault(); // disable selection
		})
		.on("mouseup", function (e) {
			if (opt.handle === "") {
				$(this).removeClass("draggable");
			} else {
				$(this).removeClass("active-handle").parent().removeClass("draggable");
			}
			var drg_h = $(this).outerHeight();
			var drg_w = $(this).outerWidth();
			console.log({
				pos_y: $(this).offset().top + drg_h - e.pageY,
				pos_x: $(this).offset().left + drg_w - e.pageX,
			});
		});
};
