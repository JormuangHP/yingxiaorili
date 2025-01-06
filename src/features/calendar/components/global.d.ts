declare namespace JSX {
    interface Element {}
  }
  
  declare namespace React {
    type ReactNode = 
      | string
      | number
      | boolean
      | null
      | undefined
      | JSX.Element
      | Array<ReactNode>;
  
    interface Component<P = {}, S = {}, SS = any> {
      render(): JSX.Element | null;
    }
  }
  
  declare module 'react' {
    interface ComponentType<P = any> {
      (props: P): JSX.Element | null;
      new (props: P): React.Component<P>;
    }
  
    interface ReactStatic {
      createElement: Function;
      Fragment: symbol;
      Component: ComponentType;
    }
    const React: ReactStatic;
    export = React;
  }
  
  declare module 'react-native' {
    export interface ViewStyle {
      alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
      justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
      position?: 'relative' | 'absolute' | 'static' | 'fixed' | 'sticky';
      width?: number | string;
      height?: number | string;
      padding?: number;
      paddingBottom?: number;
      margin?: number;
      marginBottom?: number;
      backgroundColor?: string;
      borderRadius?: number;
      flex?: number;
      cursor?: string;
      userSelect?: string;
      [key: string]: any;
    }
  
    export interface TextStyle {
      fontSize?: number;
      fontWeight?: string | number;
      color?: string;
      textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
      marginBottom?: number;
      lineHeight?: number;
      width?: string | number;
      paddingHorizontal?: number;
      [key: string]: any;
    }
  
    export type StyleProp<T> = T | Array<T | false | null | undefined>;
  
    export interface ViewProps {
      style?: StyleProp<ViewStyle>;
      children?: React.ReactNode;
    }
  
    export interface TextProps {
      style?: StyleProp<TextStyle>;
      numberOfLines?: number;
      ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
      key?: string | number;
      children?: React.ReactNode;
    }
  
    interface ComponentClass<P> {
      new(props: P): React.Component<P>;
    }
  
    export const View: ComponentClass<ViewProps>;
    export const Text: ComponentClass<TextProps>;
    export const TouchableOpacity: ComponentClass<ViewProps & {onPress?: () => void}>;
    export const ScrollView: ComponentClass<ViewProps>;
    export const Modal: ComponentClass<ViewProps & {
      visible?: boolean;
      transparent?: boolean;
      animationType?: 'none' | 'slide' | 'fade';
      onRequestClose?: () => void;
    }>;
  
    export const Platform: {
      select: <T extends {[key: string]: any}>(specifics: T) => T[keyof T];
    };
  
    export const StyleSheet: {
      create: <T extends {[key: string]: any}>(styles: T) => T;
    };
  }
  
  declare module 'react-native-calendars' {
    export interface DateData {
      year: number;
      month: number;
      day: number;
      timestamp: number;
      dateString: string;
    }
  } 