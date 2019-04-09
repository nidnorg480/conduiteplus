var page = 1;
var fullNameSearch = '';
var apiUrl = 'http://46.101.229.92:8080/';
var xhr = null;

$('#student-search').on('input', function(e){
    loadStudents($('#student-search').val());
});

$("#student-search-form").submit(function(e){
    return false;
});

$('.previous-page').on('click', function (e) {
    page--;
    loadStudents($('#student-search').val());
});

$('.next-page').on('click', function (e) {
    page++;
    loadStudents($('#student-search').val());

});

function loadStudents(fullName)
{
    if (xhr != null) {
        xhr.abort();
    }

    xhr = $.ajax(apiUrl + '/students?order[date]=desc&fullName='+fullName+'&page='+page, {
        complete: function (data) {
            if (fullName == '') {
                $('#numberOfStudents').text(data.responseJSON['hydra:totalItems']);
            }

            if (fullName != fullNameSearch) {
                page = 1;
            }

            fullNameSearch = fullName;
            updateStudents(data.responseJSON['hydra:member']);
            updatePagination(page, data.responseJSON['hydra:view']['hydra:previous'], data.responseJSON['hydra:view']['hydra:next']);
        }
    });
}

function updatePagination(currentPage, previousPage, nextPage)
{
    $('.current-page').text(currentPage);

    if (typeof(previousPage) == 'undefined') {
        $('.previous-page').addClass('hide');
    } else {
        $('.previous-page').removeClass('hide');
    }

    if (typeof(nextPage) == 'undefined') {
        $('.next-page').addClass('hide');
    } else {
        $('.next-page').removeClass('hide');
    }
}

function updateStudents(students)
{
    $('#students').find('tr:gt(0)').remove();

    students.forEach(function(student) {
        var year = student.date.substring(0, 4);
        var month = student.date.substring(5, 7);
        var day = student.date.substring(8, 10);

        $('#students tr:last').after('<tr><td><i class=""></i></td><td>'+student.fullName+'</td><td>'+day+'/'+month+'/'+year+'</td></tr>');
    });

    $('#current-page').val(page);
}

$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    loadStudents('');
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').not('.dropdown-toggle').click(function() {
    $('.navbar-toggle:visible').click();
});
