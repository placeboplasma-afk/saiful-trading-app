plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    namespace = "com.saifulothman.tradingapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.saifulothman.tradingapp"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}