import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef } from 'react';

const { Option } = Select;

interface itemState {
  name: String
  color: String
}
interface propType {
  cb:Function
}
const SquareLabel: React.FC<propType> = (propType) => {
  const [items, setItems] = useState<Array<itemState>>([])
  const [name, setName] = useState('')
  const inputRef = useRef<InputRef>(null)
  const colorRef = useRef<HTMLInputElement>(null)

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if(name === '') {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
      return      
    }
    setItems([...items, {name, color:colorRef.current? colorRef.current.value: ''}])
    setName('')
    if(items.length===0) {
      propType.cb({name, color: colorRef.current?.value})
    }
  }

  const onLabelChange = (value:string) => {
    console.log(items)
    const index = items.map(item => item.name).indexOf(value)
    propType.cb({name: items[index].name, color: items[index].color})
  }

  return (
    <Select
      style={{ width: '100%'}}
      placeholder="Labels"
      onChange={onLabelChange}
      dropdownRender={menu => (
        <>
          {menu}
          <Divider/>
          <Space>
            <Input
              placeholder="New Label"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <input ref={colorRef} type="color"></input>
            <PlusOutlined onClick={addItem}/>
          </Space>
        </>
      )}
    >
      {
        items.map(item => (
          <Option key={String(item.name)}>
            <div style={{display:'flex',flexDirection:'row',height:'25px',justifyContent:'space-between'}}>
              <svg fill={String(item.color)} style={{marginTop:'5px',width:"20px",display:'inline-block'}}>
                <rect width="20px" height="20px"></rect>
              </svg>
              <div>
                {item.name}
              </div>
            </div>
          </Option>
        ))
      }
    </Select>
  );
};

export default SquareLabel;