import React from "react";
import { MdDeleteForever } from "react-icons/md";

interface Props {
  blockedSites: string[];
  handleTagDelete(index: number): void;
}

const BlockedSitesTags = ({ blockedSites, handleTagDelete }: Props) => {
  return (
    <div className='flex gap-1 my-2 flex-wrap max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
      {blockedSites.map((site, index) => {
        return (
          <div
            key={index}
            className='text-white text-sm bg-secondary rounded pl-1 flex opacity-70'
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
