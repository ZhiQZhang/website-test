import { houseData } from './data.js';
import { initMap, renderCard } from './function.js'
const houseInfo = houseData.map(item => {
    return {
        id: item.id,
        name: item.name,
        address: item.address,
        lat: Number(item.position.split(', ')[0]),
        lng: Number(item.position.split(', ')[1]),
        status: item.status,
        price: item.price,
        Bath: item.Bath,
        Bed: item.Bed,
        Garage: item.Garage,
        sqft: item.sqft,
        lotSize: item['Lot-Size'],
        img: item.img
    }
})

$('.price-btn').click(function (e) {
    console.log($('#bed').hasClass('hide'))
    !$('#bed').hasClass('hide') ? $('#bed').addClass('hide') : ''
    !$('#type').hasClass('hide') ? $('#type').addClass('hide') : ''
    $('#price').css('top', this.offsetTop + this.offsetHeight + 10 + 'px');
    $('#price').css('left', this.offsetLeft + 'px');
    $('#price').toggleClass('hide');
})
$('.bed-btn').click(function (e) {
    !$('#price').hasClass('hide') ? $('#price').addClass('hide') : ''
    !$('#type').hasClass('hide') ? $('#type').addClass('hide') : ''
    $('#bed').css('top', this.offsetTop + this.offsetHeight + 10 + 'px');
    $('#bed').css('left', this.offsetLeft + 'px');
    $('#bed').toggleClass('hide');
})
$('.type-btn').click(function (e) {
    !$('#bed').hasClass('hide') ? $('#bed').addClass('hide') : ''
    !$('#price').hasClass('hide') ? $('#price').addClass('hide') : ''
    $('#type').css('top', this.offsetTop + this.offsetHeight + 10 + 'px');
    $('#type').css('left', this.offsetLeft - $('#type').width() + this.offsetWidth + 'px');
    $('#type').toggleClass('hide');
})
$('.filter-btn').click(function (e) {
    $('.mask').removeClass('hide');
    document.querySelector('.mask').addEventListener('click',function (e) {
        if(e.target === this){
            $('.mask').addClass('hide')
        }
    }, true)
})

let bed = []
let bath = []
const bedButtons = $('.bed-num');
const bathButtons = $('.bath-num');
bedButtons.each(function (index, item) {
    if (index !== 0) {
        $(item).click(function (e) {
            let bedArr = []
            if (!$(this).nextAll().hasClass('three')) {
                $(this).addClass('three')
                $(this).nextAll().addClass('three')
            } else {
                $(this).nextAll().removeClass('three')
            }
            $('.bed-num.three').each(function (index, item) {
                bedArr.push(Number(item.dataset.num))
            })
            bed = bedArr;
        })
    } else {
        $(item).click(function (e) {
            bed = []
            $(this).nextAll().removeClass('three')
        })
    }
})
bathButtons.each(function (index, item) {
    if (index !== 0) {
        $(item).click(function (e) {
            let bathArr = []
            if (!$(this).nextAll().hasClass('three')) {
                $(this).addClass('three')
                $(this).nextAll().addClass('three')
            } else {
                $(this).nextAll().removeClass('three')
            }
            $('.bath-num.three').each(function (index, item) {
                bathArr.push(Number(item.dataset.num))
            })
            bath = bathArr;
        })
    } else {
        $(item).click(function (e) {
            bath = []
            $(this).nextAll().removeClass('three')
        })
    }
})
let tmp = []
let tmp2 = []
let tmp3 = []
$('.bed-confirm').click(function(e){
    if(bed.length && !bath.length){
        tmp = houseInfo.filter(item => item.Bed >= bed[0] && item.Bed <= bed[bed.length - 1])
    } else if(!bed.length && bath.length){
        tmp = houseInfo.filter(item => item.Bath >= bath[0] && item.Bath <= bath[bath.length - 1])
    } else if(bed.length && bath.length){
        tmp = houseInfo.filter(item => (item.Bath >= bath[0] && item.Bath <= bath[bath.length - 1] && item.Bed >= bed[0] && item.Bed <= bed[bed.length - 1]) )
    } else {
        tmp = houseInfo
    }
    initMap(tmp)
    renderCard(tmp, 'info-col')
    $('#bed').toggleClass('hide')
    $('.bed-btn').css('border', '1px solid green')
    $('.bed-btn').css('color', 'green')

})
$('.bed-reset').click(function(e){
    $('.bath-select').children().removeClass('three')
    $('.bed-select').children().removeClass('three')
    initMap(houseInfo)
    renderCard(houseInfo, 'info-col')
    $('#bed').toggleClass('hide')
    $('.bed-btn').css('cssText', '')
})


$('.price-input').change(function(e){
    $(this).val(parseInt(e.target.value).toLocaleString('en-US', {style: 'currency', currency: 'USD'}))
})
$('.price-confirm').click(function(e){
    const minValue = $('.min-price').val();
    const maxValue = $('.max-price').val();
    if(minValue && !maxValue){
        tmp2 = houseInfo.filter(item => Number(item.price.replaceAll(',', '')) >= Number(minValue.split('$')[1].split('.')[0].replaceAll(',', '')))
    } else if(!minValue && maxValue){
        tmp2 = houseInfo.filter(item => Number(item.price.replaceAll(',', '')) <= Number(maxValue.split('$')[1].split('.')[0].replaceAll(',', '')))
    } else if(minValue && maxValue){
        tmp2 = houseInfo.filter(item => Number(item.price.replaceAll(',', '')) >= Number(minValue.split('$')[1].split('.')[0].replaceAll(',', '')) && Number(item.price.replaceAll(',', '')) <= Number(maxValue.split('$')[1].split('.')[0].replaceAll(',', '')) )
    }
    console.log(tmp2, houseInfo)
    initMap(tmp2)
    renderCard(tmp2, 'info-col')
    $('#price').toggleClass('hide')
    $('.price-btn').css('border', '1px solid green')
    $('.price-btn').css('color', 'green')
})
$('.price-reset').click(function(e){
    initMap(houseInfo)
    renderCard(houseInfo, 'info-col')
    $('#price').toggleClass('hide')
    $('.price-btn').css('cssText', '')
    $('.price-input').val('')
})


$('.house-type>button').each(function(index, item){
    $(item).click(function(e){
        $(this).toggleClass('active')
        $(this).siblings().toggleClass('active')
    })
})
