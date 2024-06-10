"use client";

import { cardsData } from "@/bin/CardsData";
import { useEffect, useState } from "react";
import { Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import LoadingSkeleton from "./LoadingSkeleton";
import { DndContext } from "@/context/DndContext";
interface Cards {
  id: number;
  title: string;
  components: {
    id: number;
    name: string;
  }[];
}
const DndExample = () => {
  const [data, setData] = useState<Cards[] | []>([]);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
      const oldDroppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId.split("droppable")[1]
      );
      const newDroppableIndex = newData.findIndex(
        (x) => x.id == destination.droppableId.split("droppable")[1]
      );
      const [item] = newData[oldDroppableIndex].components.splice(
        source.index,
        1
      );
      newData[newDroppableIndex].components.splice(destination.index, 0, item);
      setData([...newData]);
    } else {
      const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
      const droppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId.split("droppable")[1]
      );
      const [item] = newData[droppableIndex].components.splice(source.index, 1);
      newData[droppableIndex].components.splice(destination.index, 0, item);
      setData([...newData]);
    }
  };
  useEffect(() => {
    setData(cardsData);
  }, []);
  if (!data.length) {
    return <LoadingSkeleton />;
  }
  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex justify-center flex-col lg:flex-row my-2">
        {data.map((val, index) => {
          return (
            <Droppable key={index} droppableId={`droppable${index}`}>
              {(provided) => (
                <div
                  className="lg:w-1/3 w-full bg-white"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {val.components?.map((component, index) => (
                    <Draggable
                      key={component.id}
                      draggableId={component.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="flex items-center gap-4 bg-white mx-1 px-4 py-3 "
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <div className="rounded-md overflow-hidden">
                            <img
                              src={component.image}
                              width={96}
                              height={96}
                              alt="Image"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">
                              {component.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <img
                                src="/images/image.png"
                                width={16}
                                height={16}
                                alt="Location Icon"
                              />
                              <div className="text-xs font-normal text-slate-300">
                                {component.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DndContext>
  );
};

export default DndExample;
