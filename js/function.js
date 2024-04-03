import { houseData, } from "./data.js";
const { Map, InfoWindow } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
);
{/* <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
    <span><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house-chimney"></i>Lot Size: <span>${item.lotSize}</span></span>
</p> */}
const filedNum = []
for (let i = 11; i < 46; i++) {
    filedNum.push(i)
}
// 处理数据
export function processData(data, field) {
    let result = []
    data.forEach(item => {
        let obj = {}
        for (let i in item) {
            const label = field.find(item2 => item2.id === Number(i)).label
            obj[label] = item[i].value
        }
        result.push(obj)
    })
    return result;
}
export const getData = async () => {
    try {
        const res = await fetch('https://api.quickbase.com/v1/records/query', {
            method: 'POST',
            headers: {
                'QB-Realm-Hostname': 'anchorhomes.quickbase.com',
                'Authorization': 'QB-USER-TOKEN b8deue_qi2q_0_qf4xb7c43rv98cjbs2yacj5nie5',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'btwxxiycs',
                select: [6, 7, 8, 9, ...filedNum]
            })
        })
        if (res.ok) {
            const result = await res.json()
            const { data, fields } = result;
            return processData(data, fields)
        }
    } catch (e) {
        return Promise.reject(e)
    }
}

let map = null;
export async function initMap(houseInfo) {

    const infoWindow = new InfoWindow()

    map = new Map(document.getElementById("allmap"), {
        // center: { lat: 38.90931767464658 , lng: -77.17378722365528 },
        center: { lat: 38.922856383502776, lng: -77.18227289214244 },
        zoom: 13.5,
        mapId: '12aac7818bd4a829'
    })
        // map.addListener("click", (e) => {
        //     console.log("点击了", e.latLng.lat(), e.latLng.lng())
        // })
        ;
    houseInfo.forEach((item, index) => {
        const pin = new PinElement({
            glyph: `${index + 1}`,
        })
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: Number(item['Google Map Location Code'].split(',')[0]), lng: Number(item['Google Map Location Code'].split(',')[1]) },
            map,
            title: item['Address in MLS'],
        });
        marker.addListener("click", (e) => {
            console.log(e, item)
            document.querySelectorAll('.layui-card').forEach(item => {
                item.classList.remove('border');
            })
            document.querySelector(`#h${item['Project - Street ID'].trim()}`).classList.add('border');
            // 对应的卡片移至最顶端
            document.querySelector(`#h${item['Project - Street ID'].trim()}`).scrollIntoView({ behavior: "smooth", block: "center" });
            infoWindow.close();
            infoWindow.open(marker.map, marker);
            infoWindow.setContent(/*html*/`
						<div class style="width: 600px; display: flex; flex-direction: column;">
                            <h3 style="text-align:left; font-size: 20px; margin: 10px 0;">${item['Project Address']}</h3>
							<p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-dollar-sign"></i>Price: <span>${parseInt(item['List Price']).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></span>
                                <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-bath"></i>Bath: <span>${item['Number Of Bathrooms']}</span></span>
                            </p>
                            <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-bed"></i>Bed: <span>${item['Number Of Bedrooms']}</span></span>
                                <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house"></i>Garage: <span>${item['Number Of Garage']}</span></span>
                            </p>
                            <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                <span style="width: 250px;"><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-square"></i>Sqft: <span>${item['Total Finished SQFT']}</span> SQFT</span>
                            </p>
                            <p style="font-size: 16px; display: flex; justify-content: space-between; height: 30px;">
                                <span><i style="width: 30px; height: 30px;margin-right: 5px;" class="fa-solid fa-house-chimney"></i>Lot Size: <span>${item['Lot Size Acres']}Acres</span></span>
                            </p>
						</div>
					`);
        })
        // marker.addListener("click", (e) => {
        // 	console.log(e)
        // 	infoWindow.close();
        // 	infoWindow.setContent(marker.content);
        // 	infoWindow.open(marker.map, marker);
        // });
    })
}


export function renderCard(arr, className) {
    let str = '';
    if (arr.length > 0) {
        arr.forEach((item, index) => {
            str += /*html*/`
            <div id="h${item['Project - Street ID'].trim()}" class="layui-card" style="width: 98%; box-shadow:0 0 2px gray; margin-top: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div class="layui-card-header c-card-header">
                    <span  style="font-size: 1.3vw;">${item['Project Address']}</span>
                    <span style="font-size: 1.3vw;" class="${item['House Status'] === 'For Sale' ? 'sale' : ''}">FOR SALE</span>
                </div>
                <div class="layui-card-body c-card-body">
                    <div class="img" style="background-image: url(${item['Profile Pic Link']});"></div>
                    <div class="info">
                        <p class="info-header">
                            <span style="font-size: 1.2vw;">${item['Address in MLS']}</span>
                            <span style="font-size: 1.2vw;">${parseInt(item['List Price']).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span style="width: 60%;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-dollar-sign"></i>Price: <span>${parseInt(item['List Price']).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></span>
                            <span style="width: 40%;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-bath"></i>Bath: <span>${item['Number Of Bathrooms']}</span></span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span style="width: 40%;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-bed"></i>Bed: <span>${item['Number Of Bedrooms']}</span></span>
                            <span style="width: 40%;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-house"></i>Garage: <span>${item['Number Of Garage']}</span></span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span style="width: 60%;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-square"></i>Sqft: <span>${item['Total Finished SQFT']}</span> SQFT</span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-house-chimney"></i>Lot Size: <span>${item['Lot Size Acres']}Acres</span></span>
                        </p>
                        <p class="info-btn-p">
                            <button style="font-size: 1.1vw;">View Details</button>
                        </p>
                    </div>
                </div>
            </div>
            `;
        })
    } else {
        str = /*html*/`
            <div class="box">
                <p><img src="./images/error.png"/></p>
                <p>No data</p>
            </div>
        `;
    }
    document.querySelector(`.${className}`).innerHTML = str;
}

