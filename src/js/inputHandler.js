$(() => {
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-blue',
		radioClass: 'iradio_square-blue'
	});
	$('#personal-country').select2({
		width: '100%'
	});
});