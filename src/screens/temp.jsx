<ScrollView horizontal={true} className={'border h-screen content-evenly'}>
    <View>
        <View className='h-2/5 items-center bg-slate-200 '
            style={{width: screenWidth}}>
            <Avatar
                size={'xlarge'}
                rounded
                source={require("../../assets/mla-1.jpg")}
                containerStyle={{backgroundColor: "#d97706"}}
            />

            <View className='flex flex-row items-center'>

                <Text className='bg-white p-2 font-semibold text-base'>
                    विश्वनाथ भोईर कल्याण पश्चिम आमदार
                </Text>

                <Icon
                    onPress={handleLogout}
                    name="logout"
                    type='material-community'
                    color={'white'}
                    containerStyle={{
                        backgroundColor: "#9700b9",
                        padding: 8,
                    }}
                />
            </View>
        </View>

        <View className={'h-1/6 items-center justify-center'}>
            <Text
                className={'bg-app-white m-3 rounded-xl p-3 text-center font-semibold text-base'}>Statistics</Text>
        </View>
    </View>
    <View>
        <View className='h-2/5 justify-evenly items-center bg-slate-200'
            style={{width: screenWidth}}>
            <Avatar
                size={'xlarge'}
                rounded
                title="PJ"
                containerStyle={{backgroundColor: "#d97706"}}
            />

            <View className='flex flex-row items-center'>
                {userData && (
                    <Text className='bg-white p-2 font-semibold text-base'>
                        {userData.name}
                    </Text>
                )}
                <Icon
                    onPress={handleLogout}
                    name="logout"
                    type='material-community'
                    color={'white'}
                    containerStyle={{
                        backgroundColor: "#9700b9",
                        padding: 8,
                    }}
                />
            </View>
        </View>

        <View className={'h-1/6 items-center justify-center'}>
            <Text
                className={'bg-app-white m-3 rounded-xl p-3 text-center font-semibold text-base'}>Statistics</Text>
        </View>
    </View>
</ScrollView>