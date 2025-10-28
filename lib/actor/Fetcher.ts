import fetch from 'node-fetch';
import Config from '../Config';
import {interceptParameter} from '../common/utils';

export default class Fetcher {
  constructor(private readonly config: Config) {}

  private urls = {
    // ⚠️ schedules: () => 부분이 중복되는 문법 오류를 수정했습니다.
    // list.json -> timelist.json으로 변경 및 pocCode=SC0002 적용 완료
    schedules: () =>
      `https://tktapi.melon.com/api/product/schedule/timelist.json?prodId=${this.config.productId}&perfDay=20251031&pocCode=SC0002&perfTypeCode=GN0001&sellTypeCode=ST0001&v=1`,

    seats: (scheduleNo: number) =>
      `https://m.ticket.melon.com/tktapi/product/seat/seatMapList.json?v=1&prodId=${this.config.productId}&scheduleNo=${scheduleNo}&callback=getSeatListCallBack`,
  };

  async fetchSchedules(): Promise<any> {
    const response = await fetch(this.urls.schedules());

    return await response.json();
  }

  async fetchSeatMap(scheduleNo: number): Promise<any> {
    const response = await fetch(this.urls.seats(scheduleNo), {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      // pocCode=SC0002 적용 완료
      body: 'pocCode=SC0002',
    });

    return interceptParameter('getSeatListCallBack', await response.text());
  }
}
