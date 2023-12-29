var ACCESS_KEY = "xGy1WBWozacwKKKo8TOj24pVA0-IhAi35EL4v_RyYRg"
var SECRET_KEY = "1H3s_UJw5BCv_lxiXTS_0okCqpjhOLUlmsakfCdEhks"
var result_data = null
var CURRENT_POSITION = 0
$(document).ready(function () {
    loadImages()
    
})

function loadImages() {
    $.ajax({
        url: 'https://api.unsplash.com/photos',
        type: "GET",
        "headers": {
            "Authorization": ACCESS_KEY
        },
        contentType: "application/json",
        data: {
            client_id: ACCESS_KEY,
            per_page: 30
        },
        success: function (response) {
            result_data = response
            if (result_data.length > 0) {
                for (const iterator of result_data) {
                    let tagline = iterator.sponsorship ? '<a href="' + iterator.sponsorship.tagline_url + '" target="_blank" class="text-white font-11 underline-none">' + iterator.sponsorship.tagline + '</p>' : ''
                    let sponsor_tag = iterator.sponsorship ? 'Sponsored' : ''
                    $('.image-container').append(`
                        <div class="single-img single-img`+iterator.id+`" onclick="openModal(1,\``+ iterator.id + `\`)">
                        <div>
                        <img src="`+ iterator.urls.raw + `" alt="` + iterator.alt_description + `" class="img-style">
                        </div>
                        <div class="overlay-content">
                        <div class="overlay-innercontent">
                        <div class="overlay-header">
                        <div class="overlay-left">
                        <p class="text-white font-12">`+ sponsor_tag + `</p>
                        </div>
                        <div class="text-right">
                        <button class="btn-default" title="Like" id="like`+ iterator.id + `" ><i class="fa fa-heart" aria-hidden="true"></i>
                        </button>
                        <button class="btn-default" title="Add to collection" id="addCollection`+iterator.id+`"><i class="fa fa-plus" aria-hidden="true"></i>
                        </button>
                        </div>
                        </div>
                        <div class="overlay-footer">
                        <div class="user-details">
                        <img src="`+ iterator.user.profile_image.small + `" alt="userProfile" class="profile-style">
                        <div class="">
                        <p class="text-white font-12">`+ iterator.user.first_name + `</p>
                        `+ tagline + `
                        </div>
                        </div>
                        </div>
                        <div class="overlay-right">
                        <a href="`+ iterator.urls.small_s3 + `"  download="`+iterator.user.first_name+`" id="downloadPhoto`+ iterator.id + `"  class="btn-default" title="Download photo"><i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </a>
                        </div>
                        </div>
                        </div>
                        </div>`)

                        $('#like'+iterator.id).click(function(e){
                            addLike(iterator.id)
                            e.stopPropagation()
                        })
                        $('#addCollection'+iterator.id).click(function(e){
                            openModal(3,iterator.id)
                            e.stopPropagation()
                        })
                        $('#downloadPhoto'+iterator.id).click(function(e){
                            e.stopPropagation()
                        })
                }
            } else {
                $('.image-container').append(`<div class="center-align">No Data Found</div>`)
            }

        }, error: function () {

        }

    })

}

function addLike(id) {
    if($('#like' + id).hasClass('like-class')){
        $('#like' + id).removeClass('like-class')
    }else{
        $('#like' + id).addClass('like-class')
    }
}

function openModal(type, id) {
    let current_obj = null
    if(id){
        for (const iterator of result_data) {
            if (iterator.id == id) {
                current_obj = iterator
            }
        }
    }
    if (type == 1) {
        CURRENT_POSITION = result_data.indexOf(current_obj)
         $('#myDropdown').css('display','none')
        loadImageDetails()
        $('#preview-modal').show()
        $('body').css('overflow', 'hidden')

    }else if(type == 3){
        $('#collectionModal').show()
        $('.bg-image').css({
            'background-image': 'url('+current_obj.urls.small_s3+')',
        })
        $('#collectionPreview').attr('src',current_obj.urls.regular)
    } else {
        $('body').css('overflow', 'auto')
        $('.preview-modal').hide()
    }
}

function prevNextFn(type) {

    if (type == 'prev') {
        if (CURRENT_POSITION == 0) {
            $('.prev-icon').css({ 'cursor': 'default', 'opacity': 0.2 })
        } else {
            CURRENT_POSITION = CURRENT_POSITION - 1
            loadImageDetails()
        }
    } else {
        if (CURRENT_POSITION == result_data.length - 1) {
            $('.next-icon').css({ 'cursor': 'default', 'opacity': 0.2 })
        } else {
            CURRENT_POSITION = CURRENT_POSITION + 1
            loadImageDetails()
        }
    }
}

function loadImageDetails() {
    $('.prev-icon, .next-icon').css({ 'cursor': 'pointer', 'opacity': 1 })
    if (CURRENT_POSITION == 0) {
        $('.prev-icon').css({ 'cursor': 'default', 'opacity': 0.2 })
    } else if (CURRENT_POSITION == result_data.length - 1) {
        $('.next-icon').css({ 'cursor': 'default', 'opacity': 0.2 })
    }
    let current_obj = result_data[CURRENT_POSITION]

    $('#downloadBtn').attr('href',current_obj.urls.small_s3)
    $('#myDropdown').html('<a href="'+current_obj.urls.small_s3+'" download="small">Small <span>(640 * 960)</span></a>'+
    '<a href="'+current_obj.urls.small_s3+'" download="Medium">Medium <span>(1920 * 2880)</span></a>'+
    '<hr>'+
    '<a href="'+current_obj.urls.small_s3+'" download="small">Original Size <span>(2133 * 3200)</span></a>')
    $('#profileImg').attr('src', current_obj.user.profile_image.small)
    $('#userName').html(current_obj.user.first_name)
    $('.preview-body').html('<img src="' + current_obj.urls.raw + '" alt="' + current_obj.alt_description + '" class="img-style">')
}

function toggleDrop(){
    $('#myDropdown').toggle('show')
}