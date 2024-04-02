import { houseData,  } from "./data.js";
export async function initMap(houseInfo) {
    let map = null;
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
        "marker",
    );
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
            <div data-item='${JSON.stringify(item)}' id="h${item.id}" class="layui-card" style="width: 98%; box-shadow:0 0 2px gray; margin-top: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div class="layui-card-header c-card-header">
                    <span>${item.address}</span>
                    <span class="${item.status === 'for sale' ? 'sale' : ''}">FOR SALE</span>
                </div>
                <div class="layui-card-body c-card-body">
                    <div class="img" style="background-image: url(${item.img});"></div>
                    <div class="info">
                        <p class="info-header">
                            <span>${item.name}</span>
                            <span>$${item.price}</span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span style="width: 200px;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-dollar-sign"></i>Price: $ <span>${item.price}</span></span>
                            <span style="width: 200px;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-bath"></i>Bath: <span>${item.Bath}</span></span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span style="width: 200px;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-bed"></i>Bed: <span>${item.Bed}</span></span>
                            <span style="width: 200px;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-house"></i>Garage: <span>${item.Garage}</span></span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span style="width: 200px;"><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-square"></i>Sqft: <span>${item.sqft}</span>SQFT</span>
                        </p>
                        <p style="font-size: 1vw; display: flex; justify-content: space-between; height: 30px;">
                            <span><i style="width: 30px; height: 30px;margin-right: 5px;text-align: center;" class="fa-solid fa-house-chimney"></i>Lot Size: <span>${item.lotSize}</span></span>
                        </p>
                        <p class="info-btn-p">
                            <button>View Details</button>
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

