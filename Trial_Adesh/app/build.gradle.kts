plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.galaxyairline.android"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.galaxyairline.android"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    buildFeatures {
        viewBinding = true
    }
    
    lint {
        abortOnError = false
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.recyclerview)
    implementation(libs.cardview)
    implementation(libs.viewpager2)
    implementation(libs.fragment)
    implementation(libs.lifecycle.viewmodel)
    implementation(libs.lifecycle.livedata)
    implementation(libs.navigation.fragment)
    implementation(libs.navigation.ui)
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.glide)
    implementation(libs.room.runtime)
    annotationProcessor(libs.room.compiler)
    implementation(libs.coroutines.core)
    implementation(libs.coroutines.android)
    implementation(libs.gson)
    implementation(libs.workmanager)
    implementation(libs.swiperefreshlayout)
    
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}