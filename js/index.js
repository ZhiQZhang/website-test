import { houseData } from './data.js';
import { initMap, renderCard, getData, processData } from './function.js'
// const houseInfo = houseData.map(item => {
//     return {
//         id: item.id,
//         name: item.name,
//         address: item.address,
//         lat: Number(item.position.split(', ')[0]),
//         lng: Number(item.position.split(', ')[1]),
//         status: item.status,
//         price: item.price,
//         Bath: item.Bath,
//         Bed: item.Bed,
//         Garage: item.Garage,
//         sqft: item.sqft,
//         lotSize: item['Lot-Size'],
//         img: item.img
//     }
// })
const city = ['McLean', 'Falls Church', 'Vienna', 'Arlington']



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
    document.querySelector('.mask').addEventListener('click', function (e) {
        if (e.target === this) {
            $('.mask').addClass('hide')
        }
    }, true)
})
getData().then(res => {
    const houseInfo = res.sort((a, b) => {
        const cityA = city.indexOf(a['Project Address'].split(', ')[1])
        const cityB = city.indexOf(b['Project Address'].split(', ')[1])
        return cityA - cityB
    })
    console.log(houseInfo)
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
    // 外部bed和bath过滤
    $('.bed-confirm').click(function (e) {
        tmp = houseInfo.filter(item => {
            if (bed.length && !bath.length) {
                if (bed.length > 1) {
                    return item['Number Of Bedrooms'] >= Number(bed[0]) && item['Number Of Bedrooms'] <= Number(bed[bed.length - 1])
                } else {
                    return item['Number Of Bedrooms'] >= Number(bed[0])
                }
            } else if (!bed.length && bath.length) {
                if (bath.length > 1) {
                    return item['Number Of Bathrooms'] >= Number(bath[0]) && item['Number Of Bathrooms'] <= Number(bath[bath.length - 1])
                } else {
                    return item['Number Of Bathrooms'] >= Number(bath[0])
                }
            } else if (bed.length && bath.length) {
                if (bed.length > 1 && bath.length === 1) {
                    return item['Number Of Bedrooms'] >= Number(bed[0]) && item['Number Of Bedrooms'] <= Number(bed[bed.length - 1]) && item['Number Of Bathrooms'] >= Number(bath[0])
                } else if (bed.length === 1 && bath.length > 1) {
                    return item['Number Of Bathrooms'] >= Number(bath[0]) && item['Number Of Bathrooms'] <= Number(bath[bath.length - 1]) && item['Number Of Bedrooms'] >= Number(bed[0])
                } else {
                    return item['Number Of Bedrooms'] >= Number(bed[0]) && item['Number Of Bedrooms'] <= Number(bed[bed.length - 1]) && item['Number Of Bathrooms'] >= Number(bath[0]) && item['Number Of Bathrooms'] <= Number(bath[bath.length - 1])
                }
            } else {
                return item
            }
        })
        initMap(tmp)
        renderCard(tmp, 'info-col')
        $('#bed').toggleClass('hide')
        $('.bed-btn').css('border', '1px solid green')
        $('.bed-btn').css('color', 'green')
    })
    $('.bed-reset').click(function (e) {
        $('.bath-select').children().removeClass('three')
        $('.bed-select').children().removeClass('three')
        initMap(houseInfo)
        renderCard(houseInfo, 'info-col')
        $('#bed').toggleClass('hide')
        $('.bed-btn').css('cssText', '')
    })

    // 外部过滤价格
    $('.price-input').change(function (e) {
        const inputValue = parseInt(e.target.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        inputValue === '$NaN' ? $(this).val('') : $(this).val(parseInt(e.target.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
    })
    $('.price-confirm').click(function (e) {
        const minValue = $('.min-price').val();
        const maxValue = $('.max-price').val();
        if (minValue && !maxValue) {
            tmp2 = houseInfo.filter(item => Number(item['List Price']) >= Number(minValue.split('$')[1].split('.')[0].replaceAll(',', '')))
        } else if (!minValue && maxValue) {
            tmp2 = houseInfo.filter(item => Number(item['List Price']) <= Number(maxValue.split('$')[1].split('.')[0].replaceAll(',', '')))
        } else if (minValue && maxValue) {
            tmp2 = houseInfo.filter(item => Number(item['List Price']) >= Number(minValue.split('$')[1].split('.')[0].replaceAll(',', '')) && Number(item['List Price']) <= Number(maxValue.split('$')[1].split('.')[0].replaceAll(',', '')))
        }
        console.log(tmp2, houseInfo)
        initMap(tmp2)
        renderCard(tmp2, 'info-col')
        $('#price').toggleClass('hide')
        $('.price-btn').css('border', '1px solid green')
        $('.price-btn').css('color', 'green')
    })
    $('.price-reset').click(function (e) {
        initMap(houseInfo)
        renderCard(houseInfo, 'info-col')
        $('#price').toggleClass('hide')
        $('.price-btn').css('cssText', '')
        $('.price-input').val('')
    })


    $('.house-type>button').each(function (index, item) {
        $(item).click(function (e) {
            $(this).toggleClass('active')
            $(this).siblings().toggleClass('active')
        })
    })

    document.querySelectorAll('.info-btn-p button').forEach(item => {
        item.addEventListener('click', function(e){
            location.href = `../details.html?id=${e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id').split('h')[1]}`;
        })
    })

    document.querySelectorAll('.housetype-btn').forEach(item => {
        item.addEventListener('click', function (e) {
            this.classList.toggle('active')
        })
    })

    document.querySelector('.mask-confirm').addEventListener('click', function (e) {
        let arr = JSON.parse(JSON.stringify(houseInfo))
        const type = document.querySelector('.house-type>button.active').innerText;
        const price = [
            document.querySelector('.mask .min-price').value,
            document.querySelector('.mask .max-price').value
        ]
        const bed = Array.from(document.querySelectorAll('.mask-select .bed-num.three')).map(item => item.dataset.num)
        const bath = Array.from(document.querySelectorAll('.mask-select .bath-num.three')).map(item => item.dataset.num)
        const sqft = [
            document.querySelector('.mask .min-sqft').value,
            document.querySelector('.mask .max-sqft').value
        ]
        const city = document.querySelector('#city').value
        console.log(type, price, bed, bath, sqft, city)
        arr = arr.filter(item => item['House Status'] === type)
        // console.log(arr, 'type过滤')
        arr = _.filter(arr, function (item) {
            if (price[0] && !price[1]) {
                return Number(item['List Price']) >= Number(price[0].split('$')[1].replaceAll(',', ''))
            } else if (!price[0] && price[1]) {
                return Number(item['List Price']) <= Number(price[1].split('$')[1].replaceAll(',', ''))
            } else if (price[0] && price[1]) {
                return Number(item['List Price']) >= Number(price[0].split('$')[1].replaceAll(',', '')) && Number(item['List Price']) <= Number(price[1].split('$')[1].replaceAll(',', ''))
            } else {
                return item
            }
        })
        // console.log(arr, 'price过滤')
        arr = _.filter(arr, function (item) {
            if (bath.length > 1) {
                return (item['Number Of Bedrooms'] >= Number(bed[0]) && item['Number Of Bedrooms'] <= (bed[bed.length - 1]))
            } else if (bed.length === 1) {
                return (item['Number Of Bedrooms'] >= Number(bed[0]))
            } else {
                return item
            }
        })
        // console.log(arr, 'bed过滤')
        arr = _.filter(arr, function (item) {
            if (bath.length > 1) {
                return (item['Number Of Bathrooms'] >= Number(bath[0]) && item['Number Of Bathrooms'] <= (bath[bath.length - 1]))
            } else if (bath.length === 1) {
                return (item['Number Of Bathrooms'] >= Number(bath[0]))
            } else {
                return item
            }
        })
        // console.log(arr, 'bath过滤')
        arr = _.filter(arr, function (item) {
            if (sqft[0] && !sqft[1]) {
                return Number(item['Total Finished SQFT']) >= Number(sqft[0])
            } else if (!sqft[0] && sqft[1]) {
                return Number(item['Total Finished SQFT']) <= Number(sqft[1])
            } else if (sqft[0] && sqft[1]) {
                return Number(item['Total Finished SQFT']) >= Number(sqft[0]) && Number(item['Total Finished SQFT']) <= Number(sqft[1])
            } else {
                return item
            }
        })
        // console.log(arr, 'sqft过滤')
        arr = _.filter(arr, function (item) {
            if (city) {
                return item['Project Address'].split(', ')[1] === city
            } else {
                return item
            }
        })
        // console.log(arr, 'city过滤')
        console.log(arr)
        renderCard(arr, 'info-col');
        initMap(arr)
    })


    document.querySelector('.mask-reset').addEventListener('click', async function (e) {
        document.querySelector('.mask .min-price').value = '';
        document.querySelector('.mask .max-price').value = ''
        document.querySelectorAll('.mask-select .bed-num').forEach(item => item.classList.remove('three'))
        document.querySelectorAll('.mask-select .bath-num').forEach(item => item.classList.remove('three'))
        document.querySelector('.mask .min-sqft').value = '';
        document.querySelector('.mask .max-sqft').value = '';
        document.querySelector('#city').value = ''
        renderCard(houseInfo, 'info-col')
        initMap(houseInfo)
    })

    document.querySelector('.search-btn').addEventListener('click', function (e) {
        renderCard(houseInfo.filter(item => item['Project Address'].includes(document.querySelector('.search').value)), 'info-col');
        initMap(houseInfo.filter(item => item['Project Address'].includes(document.querySelector('.search').value)))
    })
})
