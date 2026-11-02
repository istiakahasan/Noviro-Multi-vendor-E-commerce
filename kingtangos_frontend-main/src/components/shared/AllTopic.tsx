
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MdKeyboardArrowRight } from 'react-icons/md'
import TopicAccordion from './TopicAccordion'

export default function AllTopic() {
  return (
    <div className='pb-14'>
      <h2 className='xl:text-4xl lg:text-3xl text-2xl font-semibold text-primary mb-4 '>All Topic</h2>
      <Tabs defaultValue="tab-1" className="items-start flex-row">
        <TabsList className="bg-transparent p-0 flex-col items-start">
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between text-base"
          >
            Recommended Topics
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none flex w-full justify-between md:text-base text-sm"
          >
            Trade
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Product FAQ
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-4"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Returns & Refunds
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-5"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Shipping & Delivery
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-6"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Payments & Pricing
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-7"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Pusing Your Account
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-8"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Orders
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-9"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Maintenance & Care
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          <TabsTrigger
            value="tab-10"
            className="data-[state=active]:bg-muted px-0 data-[state=active]:text-primary data-[state=active]:shadow-none w-full justify-between md:text-base text-sm"
          >
            Legal
            <MdKeyboardArrowRight className='text-2xl' />
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="tab-1">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-2">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-3">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-4">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-5">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-6">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-7">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-8">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-9">
          <TopicAccordion />
        </TabsContent>
        <TabsContent value="tab-10">
          <TopicAccordion />
        </TabsContent>
      </Tabs>
    </div>
  )
}
