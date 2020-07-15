import ajax from './service/weather'

interface BasicResult {
  location: string
  cid: string
  parent_city: string
  admin_area: string
  cnty: string
}

interface NowResult {
  fl: string // 体感温度
  tmp: string // 温度
  cond_txt: string // 实况天气状况描述
  wind_dir: string // 风向
  wind_sc: string // 风力
  vis: string // 能见度
  pcpn: string // 降水量
  cloud: string //云量
}
export interface WeatherResult {
  basic: BasicResult
  now: NowResult
}
function getNowWeather(location: string): Promise<WeatherResult[]> {
  return ajax
    .get<{ HeWeather6: WeatherResult[] }>('/weather/now', {
      params: {
        lang: 'zh',
        unit: 'm',
        location,
      },
    })
    .then(data => data.HeWeather6)
}

export function getWeather(location: string) {
  return getNowWeather(location)
}
