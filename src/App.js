import React, { Component } from 'react';
import './App.css';

// 1. 데이터 출력 (글 리스트)
// 2. 형식에 맞춰서 출력 (글 리스트)
// 3. 데이터 입력 (새 글 작성)
// 4. 데이터 수정과 삭제 (글 수정 / 삭제)
// 5. 기능(컴포넌트)별 파일 구성

// const BoardItem = () => (<div></div>)
class BoardForm extends Component {
    state = {}

    // 화살표 함수가 아닌 전통적인 함수로 작성하면 bind등의 제법 복잡한 처리를 해야 한다.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onSaveData(this.state);
        //this.setState({});
        this.setState(Object.assign(...Object.keys(this.state).map(k => ({[k]: null}))))
        e.target.reset();
    };

    // handleChange핸들러의 e는 자바스크립트의 change 이벤트에서 파라미터로 넘어오는 Event를 의미하고 e.target은 현재 이벤트가 발생한 개체,
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleEditView= (row) => {
        console.log(row);
        this.setState(row);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            <input placeholder="title" name="brdtitle" onChange={this.handleChange} />
            <input placeholder="name" name="brdwriter" onChange={this.handleChange}/>
            <button type="submit">Save</button>
            </form>
        );
    }
}

class BoardItem extends Component {
    // 컴포넌트 자신이 사용하는 것은 state이고,
    // 부모로부터 받은 것은 props이다.
    static defaultProps = {
        brdno: '',
        brdtitle: '',
        brdwriter: '',
        brddate: '',
        onRemove: () => console.warn('onRemove not defined')
    };
    handleRemove = () => {
        const { row, onRemove } = this.props;
        onRemove(row.brdno);
    };
    handleSelectRow = () => {
        const { row, onSelect } = this.props;
        onSelect(row);
    }

    render() {
        return (
            <tr>
                <td>{this.props.row.brdno}</td>
                <td onClick={this.handleSelectRow}>{this.props.row.brdtitle}</td>
                <td>{this.props.row.brdwriter}</td>
                <td>{this.props.row.brddate.toLocaleDateString('ko-KR')}</td>
                <td><button onClick={this.handleRemove}>X</button></td>
            </tr>
        );
    }

}

class App extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //
    //     }
    // }

    state = {
        maxNo: 3,
        boards: [
                { brdno: 1, brdwriter: 'Lee SunSin', brdtitle: 'If you intend to live then you die', brddate: new Date() },
                { brdno: 2, brdwriter: 'So SiNo', brdtitle: 'Founder for two countries', brddate: new Date() }
            ]
    }
    boardForm = React.createRef();

    handleSaveData = (data) => {
        let boards = this.state.boards;
        if (data.brdno ===null || data.brdno==='' || data.brdno===undefined) { // new : Insert
            this.setState({
                maxNo: this.state.maxNo+1,
                boards: this.state.boards.concat({ brdno: this.state.maxNo++, brddate: new Date(), ...data })
            })
        } else {
            this.setState({ boards: boards.map(row => data.brdno === row.brdno ? {...data }: row) })
        }
    }

    handleRemoveData = (brdno) => {
        this.setState({
            boards: this.state.boards.filter(row => row.brdno !== brdno)
        })
    }
    handleSelectData = (row) => {
        this.boardForm.current.handleEditView(row);
    }

    render() {
        // this는 자바스크립트에서 자기 자신(Component)을 의미한다.
        // const boards = this.state. boards;
        const { boards } = this.state;
        const list = boards.map(function(row) {
            return  row.brdno + ": " + row.brdwriter;
        });
        return (
            <div>
                <BoardForm onSaveData={this.handleSaveData} ref={this.boardForm}/>
                <table border="1">
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>Title</td>
                        <td>Name</td>
                        <td>Date</td>
                        <td>Funcs</td>
                    </tr>
                </thead>
                <tbody>
                {
                    boards.map(row=>(<BoardItem key={row.brdno} row={row} onRemove={this.handleRemoveData} onSelect={this.handleSelectData}/>))
                }
                </tbody>
                </table>
            </div>
        )
    }
}

export default App;
