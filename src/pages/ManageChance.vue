<template>
<div class="root-container">
  <div class="header-container">
    <div class="search-container">
      <Input v-model="searchWord" placeholder="搜索" clearable style="width: 200px">
        <Button slot="append" icon="ios-search"></Button>
      </Input>
      <Select v-model="currentState" style="width: 200px;margin-left:30px;">
        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Button type="primary" shape="circle" icon="plus-round" @click="createChance">新建机会</Button>
  </div>
  <div class="main-container">
    <Table border :columns="columnsData" :data="data6"></Table>
    <Page class="page" :total="100" :page-size="15"></Page>
  </div>
  <Modal
    v-model="isShowNewChanceModal"
    title="新建机会"
    @on-ok="ok"
    @on-cancel="cancel"
    :styles="modelStyles">
    <Form :model="createFormItem" :label-width="100">
        <Row>
            <Col span="12">
                <FormItem label="id">
                    <p>{{createFormItem.id}}</p>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="评分">
                    <Rate v-model="createFormItem.rate"></Rate>
                </FormItem>
            </Col>
        </Row>
        <h3 style="margin-bottom:30px">客户基本信息</h3>
        <Row>
            <Col span="12">
                <FormItem label="名称">
                  <AutoComplete
                    v-model="createFormItem.name"
                    :data="SearchNameList"
                    @on-search="handleSearchName"
                    placeholder="请输入"
                    style="width:200px"></AutoComplete>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="主营业务">
                  <Select v-model="createFormItem.department" style="width:200px;">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="联系人">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:200px;"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="电话">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:200px;"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="类型">
                  <Select v-model="createFormItem.department" style="width:200px;">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="来源">
                  <Select v-model="createFormItem.department" style="width:200px;">
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="地址">
            <Input v-model="createFormItem.name" placeholder="请输入" style="width:500px;"></Input>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="createFormItem.name" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="Enter something..." style="width:500px;"></Input>
        </FormItem>
        <Row>
            <Col span="8">
                <FormItem label="预计签单金额">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:100px;"></Input>
                </FormItem>
            </Col>
            <Col span="7">
                <FormItem label="实际签单金额">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:100px;"></Input>
                </FormItem>
            </Col>
            <Col span="7">
                <FormItem label="回扣金额">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:100px;"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="项目类型">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:100px;"></Input>
                </FormItem>
            </Col>
            <Col span="16">
                <FormItem label="项目简介">
                  <Input v-model="createFormItem.name" placeholder="请输入" style="width:340px;"></Input>
                </FormItem>
            </Col>
        </Row>
        <h3 style="margin-bottom:20px">进度追踪</h3>
        <div class="track" v-for="item in createFormItem.tracks" :key="item.id" style="margin-bottom:20px;width:700px;border-radius:10px">
          <FormItem label="进度">
            <Select v-model="item.name" style="width:200px;">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
          <FormItem label="日期">
            <DatePicker type="date" placeholder="Select date" v-model="item.date"></DatePicker>
          </FormItem>
          <FormItem label="打款金额">
            <Input v-model="item.name" placeholder="请输入" style="width:200px;"></Input>
          </FormItem>
          <FormItem label="内容">
            <Input v-model="item.name" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="Enter something..." style="width:500px;"></Input>
          </FormItem>
        </div>
        <Button type="primary" shape="circle" icon="plus-round" @click="createTrack" style="margin-bottom:20px">新建进度</Button>
        <h3 style="margin-bottom:20px">机会结果</h3>
        <FormItem label="机会结果">
          <Switch size="large" v-model="createFormItem.result">
              <span slot="open">成功</span>
              <span slot="close">失败</span>
          </Switch>
        </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
export default {
  data() {
    return {
      SearchNameList: [],
      modelStyles: {
        width: "800px",
        marginBottom: "100px"
      },
      isShowNewChanceModal: false,
      searchWord: "",
      currentState: "",
      stateList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      columnsData: [
        {
          title: "id",
          key: "id",
          width: 70,
          align: "center"
        },
        {
          title: "客户名称",
          key: "name",
          width: 100
        },
        {
          title: "当前进度",
          key: "progress",
          width: 120
        },
        {
          title: "联系人",
          key: "contact",
          width: 100
        },
        {
          title: "电话",
          key: "phone",
          width: 120
        },
        {
          title: "项目类型",
          key: "project_type",
          width: 200
        },
        {
          title: "项目简介",
          key: "project_desc",
          width: 200
        },
        {
          title: "销售负责人",
          key: "sales",
          width: 120
        },
        {
          title: "签单金额",
          key: "money",
          width: 120
        },
        {
          title: "创建时间",
          key: "create_time",
          width: 160
        },
        {
          title: "最后追踪时间",
          key: "update_time",
          width: 160
        },
        {
          title: "状态",
          key: "state",
          width: 150
        },
        {
          title: "操作",
          key: "action",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.createChance(params.row);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      data6: [
        {
          id: 100,
          name: "张三",
          phone: 1888888888,
          position: "销售经理",
          department: "市场部",
          create_time: "2000-00-00 00:00",
          permission: "超级管理员",
          state: "禁言"
        },
        {
          id: 100,
          name: "潘大庆",
          phone: 24,
          address: "London No. 1 Lake Park"
        },
        {
          id: 100,
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        }
      ],
      createFormItem: {
        id: 0,
        rate: 3,
        name: "",
        phone: "",
        department: "",
        position: "",
        pwd: "",
        tracks: [
          {
            id: "",
            name: "",
            date: new Date()
          }
        ],
        result: true
      }
    };
  },
  methods: {
    createChance() {
      this.isShowNewChanceModal = true;
    },
    editChance(user) {},
    ok() {
      this.isShowNewChanceModal = false;
      this.$Message.info("添加成功");
    },
    cancel() {
      this.isShowNewChanceModal = false;
    },
    createTrack() {
      this.createFormItem.tracks.push({
        id: "",
        name: "",
        date: new Date()
      });
    },
    handleSearchName(value) {
      this.SearchNameList = !value
        ? []
        : [value, value + value, value + value + value];
    }
  }
};
</script>

<style scoped>
.header-container {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.root-container {
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px 30px;
}
.search-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.main-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
}
.page {
  margin-bottom: 30px;
  margin-top: 30px;
  align-self: flex-end;
}
.track {
  border: 1px solid #dfdfdf;
  padding: 30px 0;
}
</style>
