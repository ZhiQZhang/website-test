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
    document.querySelector('.mask').addEventListener('click', function (e) {
        if (e.target === this) {
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
$('.bed-confirm').click(function (e) {
    if (bed.length && !bath.length) {
        tmp = houseInfo.filter(item => item.Bed >= bed[0] && item.Bed <= bed[bed.length - 1])
    } else if (!bed.length && bath.length) {
        tmp = houseInfo.filter(item => item.Bath >= bath[0] && item.Bath <= bath[bath.length - 1])
    } else if (bed.length && bath.length) {
        tmp = houseInfo.filter(item => (item.Bath >= bath[0] && item.Bath <= bath[bath.length - 1] && item.Bed >= bed[0] && item.Bed <= bed[bed.length - 1]))
    } else {
        tmp = houseInfo
    }
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


$('.price-input').change(function (e) {
    const inputValue = parseInt(e.target.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    inputValue === '$NaN' ? $(this).val('') : $(this).val(parseInt(e.target.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }))
})
$('.price-confirm').click(function (e) {
    const minValue = $('.min-price').val();
    const maxValue = $('.max-price').val();
    if (minValue && !maxValue) {
        tmp2 = houseInfo.filter(item => Number(item.price.replaceAll(',', '')) >= Number(minValue.split('$')[1].split('.')[0].replaceAll(',', '')))
    } else if (!minValue && maxValue) {
        tmp2 = houseInfo.filter(item => Number(item.price.replaceAll(',', '')) <= Number(maxValue.split('$')[1].split('.')[0].replaceAll(',', '')))
    } else if (minValue && maxValue) {
        tmp2 = houseInfo.filter(item => Number(item.price.replaceAll(',', '')) >= Number(minValue.split('$')[1].split('.')[0].replaceAll(',', '')) && Number(item.price.replaceAll(',', '')) <= Number(maxValue.split('$')[1].split('.')[0].replaceAll(',', '')))
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

$('.layui-card').each(function (index, item) {
    item.addEventListener('click', async function (e) {
        e.stopPropagation();
        console.log(e.target)
        if (e.target.innerText === 'View Details') {
            return
        }
        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
            "marker",
        );
        const infoWindow = new InfoWindow()

        const map = new Map(document.getElementById("allmap"), {
            // center: { lat: 38.90931767464658 , lng: -77.17378722365528 },
            center: { lat: JSON.parse(this.dataset.item).lat, lng: JSON.parse(this.dataset.item).lng },
            zoom: 13.5,
            mapId: '12aac7818bd4a829'
        })
        let marker = null;
        houseInfo.forEach((item, index) => {
            const pin = new PinElement({
                glyph: `${index + 1}`,
            })
            marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: item.lat, lng: item.lng },
                map,
                title: item.name,
            });
            marker.addListener("click", (e) => {
                console.log(e, item)
                document.querySelectorAll('.layui-card').forEach(item => {
                    item.classList.remove('border');
                })
                document.querySelector(`#h${item.id}`).classList.add('border');
                // 对应的卡片移至最顶端
                document.querySelector(`#h${item.id}`).scrollIntoView({ behavior: "smooth", block: "center" });
                infoWindow.close();
                infoWindow.open(marker.map, marker);
                infoWindow.setContent(/*html*/`
                            <div class style="width: 600px; display: flex; flex-direction: column;">
                                <img src="${item.img}"/>
                                <h3 style="text-align:left; font-size: 20px; margin: 10px 0;">${item.address}</h3>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-dollar-sign"></i>Price: $ <span>${item.price}</span></span>
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-bath"></i>Bath: <span>${item.Bath}</span></span>
                                </p>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-bed"></i>Bed: <span>${item.Bed}</span></span>
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house"></i>Garage: <span>${item.Garage}</span></span>
                                </p>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-square"></i>Sqft: <span>${item.sqft}</span>SQFT</span>
                                </p>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house-chimney"></i>Lot Size: <span>${item.lotSize}</span></span>
                                </p>
                            </div>
                        `);
            })
        })
        infoWindow.close()
        infoWindow.open(marker.map, marker);
        infoWindow.setContent(/*html*/`
                            <div class style="width: 600px; display: flex; flex-direction: column;">
                                <img src="${JSON.parse(this.dataset.item).img}"/>
                                <h3 style="text-align:left; font-size: 20px; margin: 10px 0;">${JSON.parse(this.dataset.item).address}</h3>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-dollar-sign"></i>Price: $ <span>${JSON.parse(this.dataset.item).price}</span></span>
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-bath"></i>Bath: <span>${JSON.parse(this.dataset.item).Bath}</span></span>
                                </p>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-bed"></i>Bed: <span>${JSON.parse(this.dataset.item).Bed}</span></span>
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house"></i>Garage: <span>${JSON.parse(this.dataset.item).Garage}</span></span>
                                </p>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-square"></i>Sqft: <span>${JSON.parse(this.dataset.item).sqft}</span>SQFT</span>
                                </p>
                                <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                    <span><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house-chimney"></i>Lot Size: <span>${JSON.parse(this.dataset.item).lotSize}</span></span>
                                </p>
                            </div>
                        `);
    }, true)
})


$('.info-btn-p').each(function (idx, item) {
    item.addEventListener('click', function (e) {
        e.stopPropagation()
        e.preventDefault();
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
    arr = arr.filter(item => item.status === type.toLowerCase())
    // console.log(arr, 'type过滤')
    arr = _.filter(arr, function (item) {
        if (price[0] && !price[1]) {
            return Number(item.price.replaceAll(',', '')) >= Number(price[0].split('$')[1].replaceAll(',', ''))
        } else if (!price[0] && price[1]) {
            return Number(item.price.replaceAll(',', '')) <= Number(price[1].split('$')[1].replaceAll(',', ''))
        } else if (price[0] && price[1]) {
            return Number(item.price.replaceAll(',', '')) >= Number(price[0].split('$')[1].replaceAll(',', '')) && Number(item.price.replaceAll(',', '')) <= Number(price[1].split('$')[1].replaceAll(',', ''))
        } else {
            return item
        }
    })
    // console.log(arr, 'price过滤')
    arr = _.filter(arr, function (item) {
        if(bath.length > 1){
            return (item.Bed >= Number(bed[0]) && item.Bed <= (bed[bed.length - 1]))
        } else if(bed.length === 1){
            return (item.Bed >= Number(bed[0]))
        } else {
            return item
        }
    })
    // console.log(arr, 'bed过滤')
    arr = _.filter(arr, function (item) {
        if(bath.length > 1){
            return (item.Bath >= Number(bath[0]) && item.Bath <= (bath[bath.length - 1]))
        } else if(bath.length === 1){
            return (item.Bath >= Number(bath[0]))
        } else {
            return item
        }
    })
    // console.log(arr, 'bath过滤')
    arr = _.filter(arr, function (item) {
        if (sqft[0] && !sqft[1]) {
            return Number(item.sqft.replaceAll(',', '')) >= Number(sqft[0])
        } else if (!sqft[0] && sqft[1]) {
            return Number(item.sqft.replaceAll(',', '')) <= Number(sqft[1])
        } else if (sqft[0] && sqft[1]) {
            return Number(item.sqft.replaceAll(',', '')) >= Number(sqft[0]) && Number(item.sqft.replaceAll(',', '')) <= Number(sqft[1])
        } else {
            return item
        }
    })
    // console.log(arr, 'sqft过滤')
    arr = _.filter(arr, function (item) {
        if(city){
            return item.address.split(', ')[1] === city
        } else {
            return item
        }
    })
    // console.log(arr, 'city过滤')
    console.log(arr)
    renderCard(arr, 'info-col');
    initMap(arr)
})


document.querySelector('.mask-reset').addEventListener('click', async function(e){
    document.querySelector('.mask .min-price').value = '';
    document.querySelector('.mask .max-sqft').value = ''
    document.querySelectorAll('.mask-select .bed-num').forEach(item => item.classList.remove('three'))
    document.querySelectorAll('.mask-select .bath-num').forEach(item => item.classList.remove('three'))
    document.querySelector('.mask .min-sqft').value = '';
    document.querySelector('.mask .max-sqft').value = '';
    document.querySelector('#city').value = ''
    renderCard(houseInfo, 'info-col')
    initMap(houseInfo)
})

document.querySelector('.search-btn').addEventListener('click',function(e){
    renderCard(houseInfo.filter(item => item.address.includes(document.querySelector('.search').value)), 'info-col');
    initMap(houseInfo.filter(item => item.address.includes(document.querySelector('.search').value)))
})
