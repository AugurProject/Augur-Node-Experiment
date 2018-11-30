pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract PerfTest {
    
    struct Data {
        uint256 a;
        uint256 b;
    }
    
    Data[] public collection;

    uint256 public index;
    
    event StateModified(uint256 indexed index, uint256 data1, uint256 data2);
    
    function modifyState(uint256 _data1, uint256 _data2) public returns (bool) {
        collection.push(Data(_data1, _data2));
        emit StateModified(index, _data1, _data2);
        index += 1;
        return true;
    }
    
    function getState10(uint256 _startIndex) public view returns (Data[10] memory _items) {
        uint256 _numItems = 10;
        _numItems = (_startIndex + _numItems > index) ? index - _startIndex : _numItems;
        for (uint256 _i = 0; _i < _numItems; _i++) {
            _items[_i] = collection[_startIndex + _i];
        }
    }
    
    function getState100(uint256 _startIndex) public view returns (Data[100] memory _items) {
        uint256 _numItems = 100;
        _numItems = (_startIndex + _numItems > index) ? index - _startIndex : _numItems;
        for (uint256 _i = 0; _i < _numItems; _i++) {
            _items[_i] = collection[_startIndex + _i];
        }
    }
    
    function getState1000(uint256 _startIndex) public view returns (Data[1000] memory _items) {
        uint256 _numItems = 1000;
        _numItems = (_startIndex + _numItems > index) ? index - _startIndex : _numItems;
        for (uint256 _i = 0; _i < _numItems; _i++) {
            _items[_i] = collection[_startIndex + _i];
        }
    }
}