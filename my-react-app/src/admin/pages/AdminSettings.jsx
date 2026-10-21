import AdminLayout from "../components/layout/AdminLayout.jsx";
import {useState} from "react";
import Button from "../../components/common/Button.jsx";
import {initialSettings} from "../data/adminSettings.js";
function AdminSettings(){
    const[settings,setSettings]=useState(initialSettings);
    function handleChange(e){
        const{name,value,type,checked}=e.target;
        setSettings({
            ...settings,
            [name]:type==="checkbox"
            ?checked
            :value
        });
    }
    function saveSettings(){
        alert("Settings saved sucessfully");
    }
    return(
        <AdminLayout >
        <h1 className="text-3xl font-bold mb-6">
            Settings
        </h1>
        <div className="bg-white rounded-xl shadow p-6">
            <div className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">
                        System Name
                    </label>
                    <input
                    type="text"
                    name="systemName"
                    value={settings.systemName}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"/>
                </div>
                <div>
                    <label className="block mb-2 font-medium">
                        Support Email
                    </label>
                    <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"/>
                </div>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input 
                        type="checkbox"
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                        />
                        Email Notification
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        name="ticketAlerts"
                        checked={settings.ticketAlerts}
                        onChange={handleChange}
                        />
                        Ticket Alerts
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        name="autoAssignment"
                        checked={settings.autoAssignment}
                        onChange={handleChange}
                        />
                        Auto Ticket Assignment
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        name="allowReopen"
                        checked={settings.allowReopen}
                        onChange={handleChange}
                        />
                        Allow Ticket Reopen
                    </label>
                </div>
                <Button text="Save Settings" onClick={saveSettings}/>
            </div>
        </div>
        </AdminLayout>

    );
}
export default AdminSettings;