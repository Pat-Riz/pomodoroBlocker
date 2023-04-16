import React from "react";
import { MdDeleteForever } from "react-icons/md";

interface Props {
  blockedSites: string[];
  handleTagDelete(index: number): void;
}

const BlockedSitesTags = ({ blockedSites, handleTagDelete }: Props) => {
  return (
    <div className='flex gap-2 my-2 flex-wrap'>
      {blockedSites.map((site, index) => {
        return (
          <div
            key={index}
            className='text-white text-sm bg-blue-800 rounded pl-1 flex opacity-70'
          >
            {site}

            <button
              onClick={() => handleTagDelete(index)}
              className='items-center p-1 text-sm'
            >
              <MdDeleteForever />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BlockedSitesTags;
