// Put library code here

function Crm_Launch(/**string*/ module)
{
	CrmLaunch(module);
}

function Crm_LaunchSales()
{
	CrmLaunchSales();
}

function Crm_ChangeArea(/**string*/ name)
{
	CrmChangeArea(name);
}

function Crm_OpenEntity(/**string*/ entity)
{
	CrmOpenEntity(entity);
}

function Crm_ClickButton(/**string*/ name)
{
	CrmClickButton(name);
}

function Crm_SelectTab(/**string*/ name)
{
	CrmSelectTab(name);
}

function Crm_LookupField(/**objectId*/ field, /**string*/ value) 
{
	CrmLookupField(field, value);
}

function Crm_ScrollTo(/**string*/ dataId)
{
	CrmScrollTo(dataId);
}

function Crm_SetDate(/**objectId*/ field, /**string*/ value)
{
	CrmSetDate(field, value);
}

function Crm_SearchRecords(/**string*/ value)
{
	CrmSearchRecords(value);
}

if (typeof(SeSGlobalObject) != "undefined")
{
	SeSGlobalObject("Crm");
}