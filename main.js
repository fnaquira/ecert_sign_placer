var responseImgs = {};

$(document).ready(function () {
	$('.firma').drags();

	$('.tab-list').on('click', '.tab', function (event) {
		event.preventDefault();

		$('.tab').removeClass('active');
		$('.tab-content').removeClass('show');

		$(this).addClass('active');
		$($(this).attr('href')).addClass('show');
	});

	$('#pdf-form').submit(function (e) {
		e.preventDefault();
		var formData = new FormData(this);
		var $previewContainer = $('#preview');
		responseImgs = {};
		$previewContainer.find('.tab-list').empty();
		var $fileList = $('.filesUploaded').empty();
		$previewContainer.find('.tab-content').remove();
		$previewContainer.find('.tab-list').append('<span>Cargando...</span>');
		$.ajax({
			url: 'http://localhost:3000/convertirlos',
			//url: 'https://ecert.resit.cl:3000/convertirlos',
			//url: 'https://pdf.favionaquira.dev/convertirlos',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				responseImgs = response;
				$('.filesUploaded').empty();
				response.forEach((fileItem, i) => {
					$fileList.append('<li><a href="javascript:loadImgs(' + i + ');">' + fileItem.name + '</a></li>');
				});
				loadImgs(0);
			},
			error: function (error) {
				console.error(error);
			}
		});
	});
});

function loadImgs(i) {
	var $previewContainer = $('#preview');
	$previewContainer.find('.tab-list').empty();
	$previewContainer.find('.tab-content').remove();
	var contador = 1;
	responseImgs[i].imgs.forEach((filename) => {
		console.log(filename);
		$previewContainer
			.find('.tab-list')
			.append('<a class="tab" href="#tab-' + contador + '">Página ' + contador + '</a>');
		$previewContainer.find('.tabs').append(
			'<div id="tab-' +
				contador +
				'" class="tab-content"><img src="http://localhost:3000/imagenes/' +
				//'" class="tab-content"><img src="https://pdf.favionaquira.dev/imagenes/' +
				filename +
				'" class="img-page"/></div>'
		);
		contador++;
	});
	$previewContainer.find('.tab:first').addClass('active');
	$previewContainer.find('.tab-content:first').addClass('show');
}

$.fn.drags = function (opt) {
	opt = $.extend({ handle: '', cursor: 'move' }, opt);

	if (opt.handle === '') {
		var $el = this;
	} else {
		var $el = this.find(opt.handle);
	}

	var firstPosition = {
		pos_y: $el.offset().top,
		pos_x: $el.offset().left
	};

	return $el
		.css('cursor', opt.cursor)
		.on('mousedown', function (e) {
			if (opt.handle === '') {
				var $drag = $(this).addClass('draggable');
			} else {
				var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			firstPosition = {
				pos_y: $drag.offset().top,
				pos_x: $drag.offset().left
			};
			var z_idx = $drag.css('z-index'),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag
				.css('z-index', 1000)
				.parents()
				.on('mousemove', function (e) {
					//contenedor
					var $contenedor = $drag.closest('.contenedor');
					var contTop = $contenedor.offset().top;
					var contLeft = $contenedor.offset().left;
					function functionValidate(e) {
						$(this).removeClass('draggable').css('z-index', z_idx);
						var drg_h = $(this).outerHeight();
						var drg_w = $(this).outerWidth();
						var pos_y = $(this).offset().top + drg_h - e.pageY;
						var pos_x = $(this).offset().left + drg_w - e.pageX;
						var tmpTop = e.pageY + pos_y - drg_h;
						var tmpLeft = e.pageX + pos_x - drg_w;
						var outside = false;
						if (tmpTop < contTop) {
							outside = true;
						}
						if (tmpTop + drg_h > contTop + $contenedor.outerHeight()) {
							outside = true;
						}
						if (tmpLeft < contLeft) {
							outside = true;
						}
						if (tmpLeft + drg_w > contLeft + $contenedor.outerWidth()) {
							outside = true;
						}
						if (outside == true) {
							$(this).offset({
								top: firstPosition.pos_y,
								left: firstPosition.pos_x
							});
							$(this).off('mouseup', functionValidate);
						}
					}
					$('.draggable')
						.offset({
							top: e.pageY + pos_y - drg_h,
							left: e.pageX + pos_x - drg_w
						})
						.on('mouseup', functionValidate);
				});
			e.preventDefault(); // disable selection
		})
		.on('mouseup', function (e) {
			if (opt.handle === '') {
				$(this).removeClass('draggable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('draggable');
			}
			var drg_h = $(this).outerHeight();
			var drg_w = $(this).outerWidth();
			console.log({
				pos_y: $(this).offset().top + drg_h - e.pageY,
				pos_x: $(this).offset().left + drg_w - e.pageX,
				new_x: $(this).offset().left - $(this).closest('.contenedor').offset().left,
				new_y: $(this).offset().top - $(this).closest('.contenedor').offset().top
			});
		});
};
