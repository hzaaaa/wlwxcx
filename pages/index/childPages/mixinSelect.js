import request from '../../../utils/request.js'
import eventBus from '../../../utils/eventBus.js'

export default{
  data:{
    selectList: {
      campus: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全校" //位置的名字
        }]
      },
      build: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
      floor: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
      room: {
        index: 0,
        array: [{
          "id": "", // 位置id
          "spaceName": "全部" //位置的名字
        }]
      },
    },
  },
  getIdFromList() {
    let ids = [];
    ids.push(this.data.selectList.campus.array[this.data.selectList.campus.index].id);
    ids.push(this.data.selectList.build.array[this.data.selectList.build.index].id);
    ids.push(this.data.selectList.floor.array[this.data.selectList.floor.index].id);
    ids.push(this.data.selectList.room.array[this.data.selectList.room.index].id);
    return ids;
  },
  getNextInfo(parentName, id) {

    let currentName = '';
    switch (parentName) {
      case 'campus':
        currentName = 'build';
        break;
      case 'build':
        currentName = 'floor';
        break;
      case 'floor':
        currentName = 'room';
        break;
      case 'room':
        currentName = '';
        break;
      default:
        currentName = '';
    }
    // debugger
    if (currentName === '') {
      eventBus.emit('updateDeviceList')
      return;
    }

    request('/weChat/spaceName', {
      id
    }).then(res => {
      res.data = [{
        spaceName: '全部',
        id: ''
      }, ...res.data]
      this.data.selectList[currentName].array = res.data;
      this.data.selectList[currentName].index = 0;
      // debugger
      this.setData({
        selectList: this.data.selectList
      })

      // debugger
      this.getNextInfo(currentName, res.data[0].id)
    }, err => {
      console.log(err)
    })
  },
  DevicePositionChange(event) {


    let currentName = event.currentTarget.id;
    let index = event.detail.value;
    let id = this.data.selectList[currentName].array[index].id;
    // 
    //更新index状态
    this.data.selectList[currentName].index = index >>> 0;
    this.setData({
      selectList: this.data.selectList
    })
    //改变设备列表
    eventBus.on('updateDeviceList', this, _ => {
      
      let pO = this.getIdFromList();
      
      // this.queryDeviceData(...pO)
      this.queryDeviceList(this.data.categoryId, ...pO);
      eventBus.remove('updateDeviceList', this)

    })
    //更新其他位置列表
    this.getNextInfo(currentName, id)

  },
}