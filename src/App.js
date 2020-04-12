import React, { useReducer, useState } from "react";
import styled from "styled-components";
import R from "ramda";

const Container = styled.div`
  font-size: 62.5%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  display: flex;
  height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Input = styled.div`
  border: 1px solid lightgray;
  width: 50%;
  height: 2rem;
  border-radius: 5px;
  padding: 0.2rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  height: 100%;
  background: transparent;
  border-radius: 5px;
  color: lightgray;
  cursor: pointer;
`;

const Field = styled.input`
  width: 100%;
  line-height: 1.13;
  height: 100%;
  box-shadow: none;
  border: none;
`;

const List = styled.ul`
  list-style: none;
  border-radius: 5px;
  height: 70%;
  width: 50%;
  overflow-y: auto;
  margin: 0;
  padding: 0.5rem 0;
`;

const ItemWrapper = styled.li`
  list-style: none;
  border: 1px solid lightgray;
  border-radius: 5px;
  height: 1.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
  margin-bottom: 0.2rem;
`;

const ItemTitle = styled.p`
  color: gray;
`;

const RemoveButton = styled(Button)``;

const types = {
  add: "ADD",
  remove: "REMOVE"
};

const isNotMember = R.curry((title, obj) => obj.title !== title);

function reducer(state, action) {
  switch (action.type) {
    case types.add: {
      const newList = R.append({ title: action.payload }, state.list);
      return { ...state, list: newList };
    }
    case types.remove: {
      const newList = R.filter(isNotMember(action.payload), state.list);
      return { ...state, list: newList };
    }
    default:
      return state.list;
  }
}

function App() {
  const [text, setText] = useState("");
  const [state, dispatch] = useReducer(reducer, { list: [{ title: "First" }] });

  const addFn = title => dispatch({ type: types.add, payload: title });
  const removeFn = title => dispatch({ type: types.remove, payload: title });

  const clearTextFn = () => {
    return function() {
      setText("");
    };
  };

  const clearText = clearTextFn();

  const add = R.compose(
    clearText,
    addFn
  );
  const remove = R.compose(
    removeFn,
    R.identity
  );

  return (
    <Container>
      <Input>
        <Field
          placeholder="single word entries only"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button onClick={() => add(text)}>Add</Button>
      </Input>
      <List>
        {state.list.map((item, i) => (
          <Item key={i} {...item} remove={remove} />
        ))}
      </List>
    </Container>
  );
}

function Item({ title, remove }) {
  return (
    <ItemWrapper>
      <ItemTitle>{title}</ItemTitle>
      <RemoveButton onClick={() => remove(title)}>X</RemoveButton>
    </ItemWrapper>
  );
}

export default App;
