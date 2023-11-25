import type { CustomerOrder, OrderTimeInfo } from '../../type'
import style from '../../style/Order/OrderInfoItem.module.css'
import triangle_style from '../../style/Order/TriangleButton.module.css'
import { useState, useEffect } from "react";

export default function OrderInfoItem({ order, handleDisclosureClick, disclosure, bulk_order }: 
    { order: CustomerOrder, handleDisclosureClick: () => any, disclosure: boolean, bulk_order: boolean }) {
    const [pickup_time_str, setPickupTimeStr] = useState("");
    const [cancel_dl_str, setCancelDLStr] = useState("");

    function cancelOrder() {
        console.log("click cancel button!");
        // TODO: cancel order
    }

    useEffect(() => {

        function buildTimeInfo(date_time: Date) {
            const DAYS: Array<string> = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
            let time_info: OrderTimeInfo = {
                year: date_time.getFullYear().toString(),
                month: date_time.getMonth().toString(),
                date: date_time.getDate().toString(),
                day: DAYS[date_time.getDay()],
                hour: ((date_time.getHours() > 12) ?
                    date_time.getHours() - 12 : date_time.getHours()).toString(),
                minute: date_time.getMinutes().toString(),
                dayPeriod: (date_time.getHours() > 12) ? "下午" : "上午",
            };
            return time_info;
        };

        function buildPickupTimeTimeInfo(order_pickup_time: Date) {
            return buildTimeInfo(order_pickup_time);
        };
        
        function buildCancelDLTimeInfo(order_pickup_time: Date) {
            let order_cancel_dl: Date = order_pickup_time;
            if (bulk_order === true) {
                order_cancel_dl.setHours(order_pickup_time.getHours() - 24);
            }
            else {
                order_cancel_dl.setHours(order_pickup_time.getHours() - 1);
            }
            return buildTimeInfo(order_cancel_dl);
        };

        function buildTimeStr(time_info: OrderTimeInfo) {
            return `${time_info.month} 月 ${time_info.date} 日 ${time_info.day}, ${time_info.dayPeriod} ${time_info.hour}:${time_info.minute}`;
        }

        let order_pickup_time: Date = new Date(order.Pickup_Time);
        let pickup_time: OrderTimeInfo = buildPickupTimeTimeInfo(order_pickup_time);
        let cancel_dl: OrderTimeInfo = buildCancelDLTimeInfo(order_pickup_time);
        setPickupTimeStr(buildTimeStr(pickup_time));
        setCancelDLStr(buildTimeStr(cancel_dl));
    }, [order, bulk_order, pickup_time_str, cancel_dl_str]);

    return (
        <div className={style.orderInfoItem_item}>
            <div className={style.orderInfoItem_leftContainer}>
                <span className={style.orderInfoItem_title}>{order.Vendor_Name}</span>
                <span className={style.orderInfoItem_note}>{'訂單編號 #' + order.Order_ID}</span>
                <span className={style.orderInfoItem_note}>{'取餐時間：' + pickup_time_str}</span>
                <span className={style.orderInfoItem_warning}>{'最後取消時間：' + cancel_dl_str}</span>
                {/* TODO: vendor name */}
                {/* TODO: 取餐時間、最後取消時間 */}
            </div>

            <div className={style.orderInfoItem_rightContainer}>
                <div className={style.orderInfoItem_cancelBox}>
                    <button className={style.orderInfoItem_cancelButton} onClick={() => cancelOrder()}>
                        <span>取消訂單</span>
                    </button>
                </div>
                <div className={style.orderInfoItem_detail}>
                    <span>{'總計: NT$' + order.Cash_Amount}</span>
                    <button className={triangle_style.triangle_buttons} onClick={() => handleDisclosureClick()}>
                        {disclosure ?
                            <div className={`${triangle_style.triangle_buttons__triangle} ${triangle_style.triangle_buttons__triangle_b}`}></div>
                            :
                            <div className={`${triangle_style.triangle_buttons__triangle} ${triangle_style.triangle_buttons__triangle_l}`}></div>
                        }
                    </button>
                </div>
            </div>
        </div>

    );
}