import { useEffect, useState } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTE,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants.js";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContactsContainer = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (res.data.contacts) {
        setDirectMessagesContacts(res.data.contacts);
      }
    };

    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (res.data.channels) {
        setChannels(res.data.channels);
      }
    };

    getChannels();
    getContacts();
  }, [setChannels, setDirectMessagesContacts]);

  const filteredContacts = directMessagesContacts.filter((contact) => {
    return (
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const filteredChannels = channels.filter((channel) => {
    return channel.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-screen relative md:w-[40vw] lg:w-[30vw] xl:w-[25vw] bg-white border border-r-1 border-t-0 border-b-0 border-gray-200 w-full">
      <ProfileInfo />

      <Tabs
        defaultValue="Personal"
        className="pt-20 text-center w-full h-[90%] bg-white "
      >
        <TabsList className="mx-auto rounded-full py-4 px-1 w-[90%] flex justify-between">
          <TabsTrigger value="All" className="rounded-full py-[6px] flex-1">
            All
          </TabsTrigger>
          <TabsTrigger
            value="Personal"
            className="rounded-full py-[6px]  flex-1"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger value="Groups" className="rounded-full py-[6px]  flex-1">
            Groups
          </TabsTrigger>
        </TabsList>
        <div className="overflow-scroll h-full no-scrollbar">
          <TabsContent value="All">
            <div className="mt-5">
              <div className="flex items-center justify-center gap-4">
                <p className="text-black/50">Groups</p>
              </div>
              <div className="max-h[38vh]">
                <ContactList contacts={channels} isChannel={true} />
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-center gap-4">
                <p className=" text-black/40">Contacts</p>
              </div>
              <div className="max-h[38vh]">
                <ContactList contacts={directMessagesContacts} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Personal">
            <div className="my-5">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="text"
                  placeholder="Search in contacts"
                  className="outline-none border-none text-black w-[70%]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <NewDM />
              </div>
              <div className="max-h[38vh]">
                <ContactList contacts={filteredContacts} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Groups">
            <div className="my-5">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="text"
                  placeholder="Search in contacts"
                  className="outline-none border-none text-black w-[70%]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <CreateChannel />
              </div>
              <div className="max-h[38vh]">
                <ContactList contacts={filteredChannels} isChannel={true} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ContactsContainer;
