import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import './index.css'
/* import region from './region' */
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

export default class TaroRegionPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityData: [],
            region: "",
            // H5、微信小程序、百度小程序、字节跳动小程序
            range: [],
            value: [0, 0, 0],
            // 支付宝小程序
            list: []
        }
    }

    getRegion() {
        CarryTokenRequest(servicePath.regionList, {})
            .then(res => {
                console.log("获取地区数据成功", res.data);
                const data = res.data;
                const province = [];
                const city = [];
                const district = [];
                for (let item of data) {
                    switch(item.level) {
                        case "province":
                            item.city =[];
                            province.push(item);
                            break;
                        case "city":
                            city.push(item);
                            break;
                        case "district":
                            district.push(item);
                            break;
                    }
                }
                for (let proItem of province) {
                    for (let cityItem of city) {
                        if (proItem.name === cityItem.parent) {
                            proItem.city.push({ name: cityItem.name, districtAndCounty: [] });
                        }
                    }
                }
                province.forEach(item => {
                    for (let districtItem of district) {
                        for (let cityItem of item.city) {
                            if (cityItem.name === districtItem.parent) {
                                cityItem.districtAndCounty.push(districtItem.name);
                            }
                        }
                    }
                    
                })
                this.setState({
                    cityData: province
                }, () => {
                    Taro.setStorageSync('cityData', JSON.stringify(province));
                    this.intCityData();
                })
            })
            .catch(err => {
                console.log("获取地区数据失败", err);
            })
        
    }

    componentWillMount() {
        let cityData = Taro.getStorageSync('cityData');
        if (cityData) {
            this.setState({
                cityData: JSON.parse(cityData)
            }, () => {
                this.intCityData();
            })
        } else {
            this.getRegion();
        }
    }

    componentDidUpdate() {
        if (this.props.value !== this.state.region) {
            this.setState({
                region: this.props.value
            })
        }
    }

    intCityData() {
        // 省市区选择器初始化
        // H5、微信小程序、百度小程序、字节跳动小程序
        let range = this.state.range;
        let temp = [];
        for (let i = 0; i < this.state.cityData.length; i++) {
            temp.push(this.state.cityData[i].name);
        }
        range.push(temp);
        temp = [];
        for (let i = 0; i < this.state.cityData[0].city.length; i++) {
            temp.push(this.state.cityData[0].city[i].name);
        }
        range.push(temp);
        temp = [];
        for (let i = 0; i < this.state.cityData[0].city[0].districtAndCounty.length; i++) {
            temp.push(this.state.cityData[0].city[0].districtAndCounty[i]);
        }
        range.push(temp);
        this.setState({
            range: range
        });
    }

    // H5、微信小程序、百度小程序、字节跳动小程序
    onChange = (e) => {
        let regionTemp = this.state.region;
        let rangeTemp = this.state.range;
        let valueTemp = this.state.value;

        valueTemp = e.detail.value;
        regionTemp = rangeTemp[0][valueTemp[0]] + '-' + rangeTemp[1][valueTemp[1]] + '-' + ( rangeTemp[2][valueTemp[2]] || "");
        this.setState({
            region: regionTemp,
            range: rangeTemp,
            value: valueTemp
        }, () => {this.props.onGetRegion(this.state.region)})
    }

    onColumnChange = (e) => {
        let rangeTemp = this.state.range;
        let valueTemp = this.state.value;

        let column = e.detail.column;
        let row = e.detail.value;

        valueTemp[column] = row;

        switch (column) {
            case 0:
                let cityTemp = [];
                let districtAndCountyTemp = [];
                for (let i = 0; i < this.state.cityData[row].city.length; i++) {
                    cityTemp.push(this.state.cityData[row].city[i].name);
                }
                for (let i = 0; i < this.state.cityData[row].city[0].districtAndCounty.length; i++) {
                    districtAndCountyTemp.push(this.state.cityData[row].city[0].districtAndCounty[i]);
                }
                valueTemp[1] = 0;
                valueTemp[2] = 0;
                rangeTemp[1] = cityTemp;
                rangeTemp[2] = districtAndCountyTemp;
                break;
            case 1:
                let districtAndCountyTemp2 = [];
                for (let i = 0; i < this.state.cityData[valueTemp[0]].city[row].districtAndCounty.length; i++) {
                    districtAndCountyTemp2.push(this.state.cityData[valueTemp[0]].city[row].districtAndCounty[i]);
                }
                valueTemp[2] = 0;
                rangeTemp[2] = districtAndCountyTemp2;
                break;
            case 2:
                break;
        }

        this.setState({
            range: rangeTemp,
            value: valueTemp
        })
    }

    // 支付宝小程序
    onClick = () => {
        let temp = this.state.region;
        my.multiLevelSelect({
            list: this.state.list,
            success: (result) => {
                if (result.success) {
                    temp = result.result[0].name + ' - ' + result.result[1].name + ' - ' + result.result[2].name;
                    this.setState({
                        region: temp
                    }, () => {this.props.onGetRegion(this.state.region)})
                }
            }
        })
    }

    render () {
        return (
            <View>
                {
                    // 支付宝不支持多列选择器，借助支付宝小程序API：my.multiLevelSelect实现省市区选择器
                    process.env.TARO_ENV === 'alipay'
                    ?
                        <View className={this.state.region == '请选择省市区'
                                            ? 'taro-region-picker taro-region-picker-gray'
                                            : 'taro-region-picker taro-region-picker-black'}
                            onClick={this.state.onClick}
                        >
                            <View>
                                <Text>{this.state.region}</Text>
                            </View>
                        </View>
                    :
                    // 使用多列选择器实现省市区选择器，支持H5、微信小程序、百度小程序、字节跳动小程序
                    // PS：微信小程序、百度小程序、字节跳动小程序支持设置Picker的属性mode='region'实现省市区选择器，但本组件均采用多列选择器方式实现
                        <View className={this.state.region == '请选择省市区'
                                            ? 'taro-region-picker taro-region-picker-gray'
                                            : 'taro-region-picker taro-region-picker-black'}
                        >
                            <Picker
                                mode='multiSelector' 
                              mode='multiSelector' 
                                mode='multiSelector' 
                              mode='multiSelector' 
                                mode='multiSelector' 
                              mode='multiSelector' 
                                mode='multiSelector' 
                              mode='multiSelector' 
                                mode='multiSelector' 
                              onChange={this.onChange}
                              onColumnChange={this.onColumnChange}
                              range={this.state.range}
                              value={this.state.value}
                              name={this.props.name}
                            >
                                <View>
                                    <Text>{this.state.region}</Text>
                                </View>
                            </Picker>
                        </View>
                }
            </View>
        )
    }
}