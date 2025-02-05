import GenericItemsPage, {
  GenericPageInfo,
} from '@/components/custom/generic-items-page'
import React from 'react'

function Foods() {
  const pageInfo: GenericPageInfo = {
    listModelName: 'foods',
    editModelName: 'food',
    singularLabel: 'food',
    pluralLabel: 'foods',
  }
  return (
    <>
      <GenericItemsPage pageInfo={pageInfo} />
    </>
  )
}

export default Foods
