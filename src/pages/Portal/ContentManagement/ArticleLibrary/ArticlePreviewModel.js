/*
 * @Author: zqm 
 * @Date: 2021-04-29 17:47:52 
 * @Last Modified by: zqm
 * @Last Modified time: 2021-05-08 18:46:07
 * 公有文章库列表
 */
import React, { Component } from 'react';
import { Modal, Radio, Input, Icon, Button } from 'antd';
import { connect } from 'dva';
const { Search } = Input;

@connect(({ ArticleLibrary, loading }) => ({
  ArticleLibrary,
  Loading: loading.effects['ArticleLibrary/getPublicListModel'],
}))
class ArticlePreviewModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioval: 'wechat',
    };
  }
  componentDidMount() {}

  render() {
    const { radioval } = this.state;
    const {
      Loading,
      ArticleLibrary: { publicList },
    } = this.props;

    return (
      <Modal
        title="文章预览"
        visible={this.props.visible}
        onOk={() => this.handleOk()}
        onCancel={() => this.props.handleCancel()}
        width={800}
        footer={null}
      >
        <div style={{ minHeight: 500, textAlign: 'center' }}>
          <Radio.Group
            value={radioval}
            onChange={e => this.setState({ radioval: e.target.value })}
            style={{ margin: '-20px 0 20px 0' }}
          >
            <Radio.Button value="wechat" style={{ width: 100 }}>
              小程序
            </Radio.Button>
            <Radio.Button value="web" style={{ width: 100 }}>
              网站
            </Radio.Button>
          </Radio.Group>
          <div
            style={{
              width: radioval === 'wechat' ? 360 : '100%',
              margin: '0 auto',
              border: '1px solid #ccc',
              height: 550,
              overflowY: 'scroll',
              padding: 16,
            }}
          >
            在北京时间5月7日晚，
            <br />
            <br />
            MSI季中冠军赛的小组赛第二日中，
            <br />
            <br />
            RNG连续击败了大洋洲赛区的PGG和独联体赛区的UOL，
            <br />
            <br />
            在北京时间5月7日晚，MSI季中冠军赛的小组赛第二日中，RNG连续击败了大洋洲赛区的PGG和独联体赛区的UOL，豪取3连胜领跑A组。让我们来看一下Reddit网友们对于这场比赛的评价吧。
            豪取3连胜领跑A组。
            <br />
            <br />
            让我们来看一下Reddit网友们对于这场比赛的评价吧。 —<br />
            <br />
            这可能是种仁慈了，RNG现在面对这种队伍实在是太强大了。 —<br />
            <br />
            在北京时间5月7日晚，MSI季中冠军赛的小组赛第二日中，RNG连续击败了大洋洲赛区的PGG和独联体赛区的UOL，豪取3连胜领跑A组。让我们来看一下Reddit网友们对于这场比赛的评价吧。
            更恐怖的是RNG以“程序化”的游戏风格闻名于世，这让比赛更是种折磨。 —<br />
            <br />
            是的，RNG的运营是LPL里最厉害的，所以他们不太可能会送。 —<br />
            <br />
            在北京时间5月7日晚，MSI季中冠军赛的小组赛第二日中，RNG连续击败了大洋洲赛区的PGG和独联体赛区的UOL，豪取3连胜领跑A组。让我们来看一下Reddit网友们对于这场比赛的评价吧。
            游戏水平差距太大，RNG就像在“打人机”......
            <br />
            <br />
          </div>
          <Button type="primary" style={{ margin: '30px auto 0' }}>
            使用文章
          </Button>
        </div>
      </Modal>
    );
  }
  handleOk = () => {
    this.props.handleOk();
  };
}

export default ArticlePreviewModel;
